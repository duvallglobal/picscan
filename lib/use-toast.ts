import { useToast as useToastUI } from "@/components/ui/use-toast";

export interface ToastOptions {
  title?: string;
  description: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const toast = useToastUI();

  const showToast = ({ title, description, variant = "default" }: ToastOptions) => {
    try {
      toast.toast({
        title,
        description,
        variant,
      });
    } catch (error) {
      console.error("Failed to show toast:", error);
      // Fallback to alert if toast fails
      alert(`${title ? title + ': ' : ''}${description}`);
    }
  };

  return { showToast };
}
