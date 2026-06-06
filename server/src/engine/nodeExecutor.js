import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function executeNode(node, context) {
  switch (node.type) {
    case "trigger":
      return executeTriggerNode(node, context);

    case "ai":
      return executeAiNode(node, context);

    case "condition":
      return executeConditionNode(node, context);

    case "action":
      return executeActionNode(node, context);

    default:
      throw new Error(`Unsupported node type: ${node.type}`);
  }
}

async function executeTriggerNode(node, context) {
  return {
    triggerReceived: true,
    triggerLabel: node.label,
    input: context,
  };
}

async function executeAiNode(node, context) {
  const systemPrompt =
    node.config?.prompt ??
    "You are a helpful AI assistant embedded in a workflow automation system.";

  const userMessage = `Workflow context:\n${JSON.stringify(context, null, 2)}\n\nAnalyze the above context. Your response must be a single raw JSON object with no markdown, no code fences, no extra text — just the JSON:\n{"score": <0-100>, "summary": "<2-3 sentence analysis>"}`;

  const response = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const rawText = textBlock?.text ?? "{}";

  let parsed;
  try {
    const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    parsed = { score: 0, summary: rawText };
  }

  return {
    aiResult: {
      score: parsed.score ?? 0,
      summary: parsed.summary ?? rawText,
      promptUsed: node.config?.prompt ?? null,
    },
  };
}

async function executeConditionNode(node, context) {
  const field = node.config?.field;
  const operator = node.config?.operator;
  const value = node.config?.value;

  const actualValue =
    context[field] ??
    context.aiResult?.[field] ??
    context.output?.[field];

  let passed = false;

  switch (operator) {
    case ">":
      passed = actualValue > value;
      break;
    case "<":
      passed = actualValue < value;
      break;
    case ">=":
      passed = actualValue >= value;
      break;
    case "<=":
      passed = actualValue <= value;
      break;
    case "===":
      passed = actualValue === value;
      break;
    case "!==":
      passed = actualValue !== value;
      break;
    default:
      throw new Error(`Unsupported condition operator: ${operator}`);
  }

  return {
    condition: {
      field,
      operator,
      expected: value,
      actual: actualValue,
      passed,
    },
    conditionPassed: passed,
  };
}

async function executeActionNode(node, context) {
  return {
    actionResult: {
      channel: node.config?.channel ?? "console",
      message: node.config?.message ?? "Action executed",
      sent: true,
    },
  };
}
