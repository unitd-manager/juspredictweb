import { useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";

import { groupApi, type GroupMode } from "../../api/groupDyn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/Dialog";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { toast } from "../../components/ui/sonner";

type CreateClanDialogProps = {
  trigger?: ReactNode;
  onCreated?: (groupId?: string) => void;
};

const DEFAULT_MODE: GroupMode = "PRIVATE";

export const CreateClanDialog = ({ trigger, onCreated }: CreateClanDialogProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [alias, setAlias] = useState("");
  const [mode, setMode] = useState<GroupMode>(DEFAULT_MODE);
  const [autoJoin, setAutoJoin] = useState(true);
  const [userId, setUserId] = useState("");

  const resetState = () => {
    setGroupName("");
    setAlias("");
    setMode(DEFAULT_MODE);
    setAutoJoin(true);
    setUserId("");
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        groupName,
        alias: alias || undefined,
        mode,
        join: autoJoin,
        userId: userId || undefined,
      };
      return groupApi.createGroup(payload);
    },
    onSuccess: (data) => {
      toast.success("Clan created successfully");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      onCreated?.(data.groupId);
      setOpen(false);
      resetState();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create clan");
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!groupName.trim()) return;
    await mutateAsync();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create clan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create a new clan</DialogTitle>
            <DialogDescription>
              Give your clan a name, choose how members join, and optionally set your internal alias.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="groupName">Clan name</Label>
            <Input
              id="groupName"
              placeholder="E.g. Ind-NZ Womens Oct 23"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alias">Alias / short code</Label>
            <Input
              id="alias"
              placeholder="Optional short code"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Clan mode</Label>
            <Select value={mode} onValueChange={(value) => setMode(value as GroupMode)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public - anyone can join</SelectItem>
                <SelectItem value="PRIVATE">Private - invite only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
            <div>
              <Label htmlFor="autoJoin">Auto join after creation</Label>
              <p className="text-sm text-muted-foreground">
                Toggle off if you are creating on behalf of someone else.
              </p>
            </div>
            <Switch id="autoJoin" checked={autoJoin} onCheckedChange={setAutoJoin} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">Your user ID (optional)</Label>
            <Input
              id="userId"
              placeholder="Supply if the API requires it"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              We fall back to the authenticated token, but some environments still expect an explicit user ID.
            </p>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!groupName.trim() || isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create clan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClanDialog;

