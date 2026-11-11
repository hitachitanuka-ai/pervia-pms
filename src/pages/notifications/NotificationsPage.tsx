import React, { useState } from 'react';
import { db } from '../../lib/database';
import { NotificationItem } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Bell, Check, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(db.getNotifications());

  const handleMarkAsRead = (id: string) => {
    db.markNotificationRead(id);
    setNotifications([...db.getNotifications()]);
  };

  const handleMarkAllRead = () => {
    notifications.forEach((n) => db.markNotificationRead(n.id));
    setNotifications([...db.getNotifications()]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">Notifications Center</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            System announcements, evaluation alerts, and workflow notices
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-10 h-10 text-[#94A3B8] mx-auto mb-2" />
              <h3 className="text-sm font-bold text-[#172B4D]">No Notifications</h3>
              <p className="text-xs text-[#64748B] mt-1">You have received all updates.</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((n) => (
            <Card
              key={n.id}
              className={`transition-colors ${!n.read ? 'border-l-4 border-l-[#315E91] bg-[#F8FAFC]' : ''}`}
            >
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      n.type === 'warning'
                        ? 'bg-[#FEF9E7] text-[#B45309]'
                        : n.type === 'alert'
                        ? 'bg-[#FDF2F2] text-[#DC4545]'
                        : 'bg-[#EAF1F8] text-[#315E91]'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#172B4D]">{n.title}</p>
                      {!n.read && (
                        <Badge size="sm" variant="info">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] mt-1">{n.message}</p>
                    <span className="text-[11px] text-[#94A3B8] flex items-center gap-1 mt-1.5">
                      <Clock className="w-3 h-3" /> {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!n.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(n.id)}
                      leftIcon={<Check className="w-3.5 h-3.5" />}
                    >
                      Read
                    </Button>
                  )}
                  {n.link && (
                    <Link to={n.link}>
                      <Button variant="outline" size="sm" rightIcon={<ExternalLink className="w-3 h-3" />}>
                        View
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
