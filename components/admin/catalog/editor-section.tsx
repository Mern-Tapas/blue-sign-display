import { FormSection } from "@/components/ui/form-section";

export type EditorSectionProps = {
  title: string;
  description?: React.ReactNode;
  /** Right-aligned header slot (a count, a text button). */
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

/**
 * One titled card in the product editor.
 *
 * Now a thin wrapper over the shared `FormSection` (`layout="card"`), kept so existing
 * editor screens keep their import and their props.
 */
export function EditorSection({ title, description, action, className, children }: EditorSectionProps) {
  return (
    <FormSection title={title} description={description} action={action} layout="card" className={className}>
      {children}
    </FormSection>
  );
}
