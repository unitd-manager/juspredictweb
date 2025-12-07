import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog';
//import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { toast } from '../ui/Toast';

interface InviteMembersDialogProps {
  groupId: string;
  groupName?: string;
  trigger?: React.ReactNode;
  onInvited?: () => void;
}

export const InviteMembersDialog: React.FC<InviteMembersDialogProps> = ({
  //groupId,
  groupName,
  trigger,
  onInvited,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [emails, setEmails] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emails.trim()) {
      toast.error('Please enter at least one email');
      return;
    }

    setIsPending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Invitations sent successfully');
      setEmails('');
      setIsOpen(false);
      onInvited?.();
    } catch (err) {
      toast.error((err as Error).message || 'Failed to send invitations');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(next) => !isPending && setIsOpen(next)}>
      <DialogTrigger onClick={() => setIsOpen(true)}>
        {trigger || <Button>Invite members</Button>}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Invite members to {groupName || 'clan'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-text">Email addresses</label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="Enter email addresses (one per line)"
              className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-muted focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all resize-none h-32"
              required
            />
            <p className="text-xs text-gray-muted">
              Enter email addresses separated by new lines
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Send Invites
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
