const BASE_URL = "https://newsapi.bdtechdemo.online/api";

/* =========================
   TOKEN MANAGEMENT
========================= */
export const tokenManager = {
  setToken: (token) => {
    localStorage.setItem("authToken", token);
  },

  getToken: () => {
    return localStorage.getItem("authToken");
  },

  removeToken: () => {
    localStorage.removeItem("authToken");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },
};

/* =========================
   USER MANAGEMENT
========================= */
export const userManager = {
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    localStorage.removeItem("user");
  },

  logout: () => {
    tokenManager.removeToken();
    userManager.removeUser();
  },
};

/* =========================
   RESPONSE NORMALIZER
========================= */
const normalizeData = (res) => {
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
};

/* =========================
   ERROR HANDLER
========================= */
const handleError = async (res) => {
  let message = "Something went wrong";
  try {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json();
      message = errorData?.message || errorData?.error || message;
    } else {
      const textError = await res.text();
      message = textError || `Server Error (${res.status})`;
    }
  } catch (err) {
    console.error("Failed to parse error response:", err);
  }
  throw new Error(message);
};

/* =========================
   LOGIN
========================= */
export const login = async (email, password) => {
  const url = `${BASE_URL}/login`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData?.message || "Login failed");
    }

    if (resData?.success && resData?.data?.token) {
      const token = resData.data.token;
      const user = resData.data.user;

      tokenManager.setToken(token);
      if (user) {
        userManager.setUser(user);
      }

      return resData;
    }

    throw new Error(resData?.message || "Invalid login response structure");
  } catch (error) {
    console.error("Login API Error:", error.message);
    throw error;
  }
};

/* =========================
   LOGOUT
========================= */
export const logout = () => {
  userManager.logout();
};

/* =========================
   GENERIC API REQUEST
========================= */
export const fetchData = async (
  endpoint,
  { method = "GET", body = null, headers = {}, raw = false } = {}
) => {
  const token = tokenManager.getToken();

  // Clean Endpoint URL slash issue
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

  const requestHeaders = {
    Accept: "application/json",
    ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const config = {
    method,
    headers: requestHeaders,
  };

  if (method !== "GET" && method !== "HEAD" && body) {
    config.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}/${cleanEndpoint}`, config);

    if (response.status === 401 || response.status === 403) {
      console.warn("Unauthenticated / Unauthorized request caught.");
      tokenManager.removeToken();
      // Optional: window.location.href = "/login";
      throw new Error("Unauthenticated.");
    }

    if (!response.ok) {
      await handleError(response);
    }

    const json = await response.json();
    return raw ? json : normalizeData(json);
  } catch (error) {
    console.error(`API Request Error [${cleanEndpoint}]:`, error.message);
    throw error;
  }
};

/* =========================
   HELPER FOR QUERY PARAMS
========================= */
const buildEndpoint = (endpoint, params) => {
  if (!params || typeof params !== "object" || Object.keys(params).length === 0) {
    return endpoint;
  }
  const query = new URLSearchParams(params).toString();
  return `${endpoint}?${query}`;
};

/* =========================
   SECTION API CALLS
========================= */

// Top Menu bar
export const getTopCategoriesData = (params) => fetchData(buildEndpoint("categories/index", params));
export const storeTopCategoriesData = (data) =>
  fetchData("categories/store", { method: "POST", body: data });
export const updateTopCategoriesData = (id, data) =>
  fetchData(`categories/update/${id}`, { method: "POST", body: data });
export const deleteTopCategoriesData = (id) =>
  fetchData(`categories/delete/${id}`, { method: "DELETE" });


// Authors
export const getAuthorsData = (params) => fetchData(buildEndpoint("authors/index", params));
export const storeAuthorsData = (data) =>
  fetchData("authors/store", { method: "POST", body: data });
export const updateAuthorsData = (id, data) =>
  fetchData(`authors/update/${id}`, { method: "POST", body: data });
export const deleteAuthorsData = (id) =>
  fetchData(`authors/delete/${id}`, { method: "DELETE" });


// News

export const getNewsData = (page = 1) => {
  return fetchData(`news/index?page=${page}`, { raw: true });
};
export const storeNewsData = (data) =>
  fetchData("news/store", { method: "POST", body: data });
export const updateNewsData = (id, data) =>
  fetchData(`news/update/${id}`, { method: "POST", body: data });
export const deleteNewsData = (id) =>
  fetchData(`news/delete/${id}`, { method: "DELETE" });


// Section
export const getSectionsData = (params) => fetchData(buildEndpoint("sections/index", params));
export const storeSectionsData = (data) =>
  fetchData("sections/store", { method: "POST", body: data });
export const updateSectionsData = (id, data) =>
  fetchData(`sections/update/${id}`, { method: "POST", body: data });
export const deleteSectionsData = (id) =>
  fetchData(`sections/delete/${id}`, { method: "DELETE" });




// good api
export const getSection = () => fetchData("section-data");
export const getCategory = () => fetchData("category-data");
export const getAuthor = () => fetchData("author-data");




/* =========================
   COMMON CRUD HELPERS
========================= */
export const getData = (endpoint) => fetchData(endpoint);
export const createData = (endpoint, data) =>
  fetchData(endpoint, { method: "POST", body: data });
export const updateData = (endpoint, data) =>
  fetchData(endpoint, { method: "PUT", body: data });
export const deleteData = (endpoint) =>
  fetchData(endpoint, { method: "DELETE" });