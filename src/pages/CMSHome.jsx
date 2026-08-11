import { FileText, Users, Mail, Clock } from 'lucide-react';
import { cmsMetrics, blogPosts, announcements } from '../data/cms-data';

export function CMSHome({ onNavigate }) {
  const metrics = [
    { label: 'Published Posts', value: cmsMetrics.publishedPosts, icon: FileText, color: 'metric-icon-blue' },
    { label: 'Draft Posts', value: cmsMetrics.draftPosts, icon: Clock, color: 'metric-icon-amber' },
    { label: 'Subscribers', value: cmsMetrics.totalSubscribers.toLocaleString(), icon: Mail, color: 'metric-icon-indigo' },
    { label: 'Team Members', value: cmsMetrics.activeTeamMembers, icon: Users, color: 'metric-icon-green' }
  ];

  return (
    <div className="space-y-8">
      <div>
       <h1 className="page-title">Prothom <span className='text-red-600'>ALo</span> Dashboard</h1>
        <p className="page-subtitle">Welcome back to your content management hub</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="premium-card-hover p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">{metric.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${metric.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blog Posts */}
        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">Recent Blog Posts</h2>
            <button 
              onClick={() => onNavigate('blog')}
              className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {blogPosts.slice(0, 3).map(post => (
              <div key={post.id} className="pb-3 border-b section-divider last:border-0 last:pb-0">
                <h3 className="font-medium text-foreground">{post.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{post.author}</span>
                  <span className={post.status === 'published' ? 'badge-success' : 'badge-warning'}>
                    {post.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">Announcements</h2>
            <button 
              onClick={() => onNavigate('announcements')}
              className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map(announcement => (
              <div key={announcement.id} className="pb-3 border-b section-divider last:border-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-foreground flex-1">{announcement.title}</h3>
                  <span className={`whitespace-nowrap ml-2 ${
                    announcement.priority === 'high' ? 'badge-danger' :
                    announcement.priority === 'medium' ? 'badge-warning' :
                    'badge-info'
                  }`}>
                    {announcement.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="premium-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => onNavigate('blog')}
            className="btn-secondary p-3 text-sm"
          >
            New Blog Post
          </button>
          <button 
            onClick={() => onNavigate('gallery')}
            className="btn-secondary p-3 text-sm"
          >
            Upload Image
          </button>
          <button 
            onClick={() => onNavigate('announcements')}
            className="btn-secondary p-3 text-sm"
          >
            New Announcement
          </button>
          <button 
            onClick={() => onNavigate('team')}
            className="btn-secondary p-3 text-sm"
          >
            Add Team Member
          </button>
        </div>
      </div>
    </div>
  );
}
