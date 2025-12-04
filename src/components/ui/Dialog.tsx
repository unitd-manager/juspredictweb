import React, { useState } from 'react';
//import { X } from 'lucide-react';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

interface DialogFooterProps {
  children: React.ReactNode;
}

const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

export const Dialog: React.FC<DialogProps> = ({ open: controlledOpen, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerProps
>(({ asChild, children, onClick }, ref) => {
  const { setOpen } = React.useContext(DialogContext);
if (asChild && React.isValidElement(children)) {
  // Narrow the child element so TS knows it may have an onClick prop
  const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;

  // Build the handler once to keep code tidy
  const handleClick = (e: React.MouseEvent) => {
    // call child's onClick (if present) and forward the event
    child.props.onClick?.(e);

    // call outer onClick and forward event as well (safe even if outer expects no args)
    onClick?.();

    // your internal side-effect
    setOpen(true);
  };

  // Clone element and override/merge the onClick
  return React.cloneElement(child, {
    // Optional: spread existing props to be explicit (cloneElement already merges props)
    ...child.props,
    onClick: handleClick,
  });
}


  return (
    <button
      ref={ref}
      onClick={() => {
        onClick?.();
        setOpen(true);
      }}
      className="inline-flex items-center justify-center rounded-lg font-medium transition-all"
    >
      {children}
    </button>
  );
});

DialogTrigger.displayName = 'DialogTrigger';

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(({ children, className = '' }, ref) => {
  const { open, setOpen } = React.useContext(DialogContext);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
    >
      <div
        ref={ref}
        className={`bg-dark-card border border-white/10 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
});

DialogContent.displayName = 'DialogContent';

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

export const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => {
  return <h2 className="text-lg font-semibold text-white">{children}</h2>;
};

export const DialogDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <p className="text-sm text-muted-foreground mt-1">{children}</p>;
};

export const DialogFooter: React.FC<DialogFooterProps> = ({ children }) => {
  return <div className="mt-6 flex gap-3 justify-end">{children}</div>;
};
