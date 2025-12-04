import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { toast } from '../ui/Toast';

interface CancelInviteDialogProps {
  groupId: string;
  trigger?: React.ReactNode;
}

export const CancelInviteDialog: React.FC<CancelInviteDialogProps> = ({ groupId, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsPending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      toast.success('Invitation cancelled');
      setEmail('');
      setIsOpen(false);
    } catch (err) {
      toast.error((err as Error).message || 'Failed to cancel invitation');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(next) => !isPending && setIsOpen(next)}>
      <DialogTrigger onClick={() => setIsOpen(true)}>
        {trigger || <Button variant="outline">Cancel invites</Button>}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Cancel invitation</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-text">Email address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to cancel"
              required
            />
            <p className="text-xs text-gray-muted">
              Enter the email address of the pending invitation to cancel
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
              Cancel Invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
