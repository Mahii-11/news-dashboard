import { useState } from "react";
import { useLocation } from "react-router";
import { ChevronRight, ChevronDown } from "lucide-react";
import * as Icons from "lucide-react";
import { cmsNavigation } from "../data/cms-data";

const iconMap = {
  Navigation: Icons.Navigation,
  Menu: Icons.Menu,
  Layers: Icons.Layers,
  PenLine: Icons.PenLine,
  Image: Icons.Image,
  BookOpen: Icons.BookOpen,
  Users: Icons.Users,
  Newspaper: Icons.Newspaper,
  Clapperboard: Icons.Clapperboard,
};

export default function Sidebar({ open, onToggle, onNavigate }) {
  const location = useLocation();

  // Group collapsible state
  const [expandedGroups, setExpandedGroups] = useState({
    Dashboard: true,
    "Website Sections": true,
    "Media & Assets": false,
    Communication: false,
    Settings: false,
  });

  // Nested Sub-menu / Parent Item collapsible state
  const [openSubMenus, setOpenSubMenus] = useState({});

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const toggleSubMenu = (itemId) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <div
      className={`${
        open ? "w-64" : "w-20"
      } transition-all duration-300 sidebar-shell flex flex-col h-screen flex-shrink-0`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {open && (
          <div className="flex items-center gap-2">
            <img
              src="/images/newslogo.jpg"
              alt="BanglaTech Logo"
              className="w-auto h-20 md:h-24 object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <button
          onClick={onToggle}
          className="icon-btn p-1.5"
          aria-label="Toggle sidebar"
        >
          <ChevronRight
            size={20}
            className={`${
              !open ? "rotate-180" : ""
            } transition-transform duration-300`}
          />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
        {cmsNavigation.map((group) => {
          const isExpanded = expandedGroups[group.group];

          // Check active route in main items or nested children
          const isGroupActive = group.items.some(
            (item) =>
              location.pathname.startsWith(item.id) ||
              item.children?.some((child) =>
                location.pathname.startsWith(child.id)
              )
          );

          const shouldExpand = open ? isExpanded || isGroupActive : false;

          return (
            <div key={group.group}>
              {/* Group Title */}
              {open && (
                <button
                  onClick={() => toggleGroup(group.group)}
                  className="flex items-center justify-between w-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors"
                >
                  {group.group}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                      shouldExpand ? "" : "-rotate-90"
                    }`}
                  />
                </button>
              )}

              {/* Expanded Items */}
              {open && shouldExpand && (
                <div className="space-y-0.5 mt-0.5">
                  {group.items.map((item) => {
                    const IconComponent = iconMap[item.icon];
                    const hasChildren = item.children && item.children.length > 0;

                    // Active States
                    const isChildActive = item.children?.some(
                      (child) => location.pathname === child.id
                    );
                    const isParentActive =
                      location.pathname === item.id || isChildActive;

                    const isSubOpen =
                      openSubMenus[item.id] !== undefined
                        ? openSubMenus[item.id]
                        : isChildActive; // Auto-open if active sub-child

                    // Case A: Item HAS Children (Sub-pages)
                    if (hasChildren) {
                      return (
                        <div key={item.id} className="space-y-1">
                          <button
                            onClick={() => toggleSubMenu(item.id)}
                            className={`nav-item w-full flex items-center justify-between ${
                              isParentActive ? "text-primary font-medium" : ""
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {IconComponent && <IconComponent size={18} />}
                              <span>{item.label}</span>
                            </div>
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-200 ${
                                isSubOpen ? "" : "-rotate-90"
                              }`}
                            />
                          </button>

                          {/* Sub Children Links */}
                          {isSubOpen && (
                            <div className="pl-6 space-y-0.5 border-l-2 border-border ml-4">
                              {item.children.map((child) => {
                                const isSubItemActive =
                                  location.pathname === child.id;

                                return (
                                  <button
                                    key={child.id}
                                    onClick={() => onNavigate(child.id)}
                                    className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all flex items-center ${
                                      isSubItemActive
                                        ? "bg-accent/10 text-primary font-semibold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                                  >
                                    {child.label}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Case B: Item WITHOUT Children (Normal Link)
                    return (
                      <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`nav-item w-full flex items-center gap-2 ${
                          isParentActive ? "nav-item-active" : ""
                        }`}
                      >
                        {IconComponent && <IconComponent size={18} />}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Collapsed Mode (Only Icons) */}
              {!open && (
                <div className="space-y-0.5">
                  {group.items.slice(0, 3).map((item) => {
                    const IconComponent = iconMap[item.icon];
                    const isActive =
                      location.pathname === item.id ||
                      item.children?.some(
                        (child) => location.pathname === child.id
                      );

                    return (
                      <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`flex items-center justify-center w-full p-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "nav-item-active"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        title={item.label}
                      >
                        {IconComponent && <IconComponent size={18} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 avatar-gradient rounded-xl flex items-center justify-center font-semibold text-sm shadow-glow flex-shrink-0">
            {open ? "Bd " : "B"}
          </div>

          {open && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                Admin User
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Content Manager
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}