import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../ui/Dialog";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { toast } from "../ui/sonner";
import { groupApi } from "../../api/groupDyn";

interface InviteMembersDialogProps {
  groupId: string;
  groupName: string;
  trigger: React.ReactNode;
  onInvited?: () => void;
}

export function InviteMembersDialog({ groupId, groupName, trigger, onInvited }: InviteMembersDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const inviterUserId = localStorage.getItem("userId") || ""; // or from auth context

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      groupApi.inviteMembers({
        groupId,
        groupName,
        inviterUserId,
        invites: [
          {
            inviteeEmail: email,
            inviteeName: name,
            eventType: 1,
          },
        ],
      }),

    onSuccess: () => {
      toast.success("Invitation sent");
      setOpen(false);
      setEmail("");
      setName("");
      onInvited?.();
    },

    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to send invitation");
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !isPending && setOpen(v)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={submit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Invite a member</DialogTitle>
          </DialogHeader>

          <div>
            <label className="text-sm">Member Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="text-sm">Name (optional)</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <span className="mr-2 animate-spin">⏳</span>}
              Send Invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
