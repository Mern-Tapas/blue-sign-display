import { Button, ProductQnA, sampleData } from "@bluesigns/ui";

const { productQuestions } = sampleData;
const wait = () => new Promise<void>((r) => setTimeout(r, 700));

export const WithAskForm = () => (
  <div style={{ maxWidth: 720 }}>
    <ProductQnA questions={productQuestions} onAsk={wait} />
  </div>
);

export const SignedOut = () => (
  <div style={{ maxWidth: 720 }}>
    <ProductQnA
      questions={productQuestions}
      visibleCount={2}
      askPrompt={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-body text-fg-muted">Sign in to ask the seller or verified buyers.</p>
          <Button size="sm" variant="secondary">
            Sign in
          </Button>
        </div>
      }
    />
  </div>
);

export const NoQuestionsYet = () => (
  <div style={{ maxWidth: 720 }}>
    <ProductQnA questions={[]} onAsk={wait} />
  </div>
);
