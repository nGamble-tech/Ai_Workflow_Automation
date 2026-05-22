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
  // Mock AI for now. Later we will replace this with a real OpenAI call.
  //False condition node will always be executed because score is below 80, change as needed for testing
  return {
    aiResult: {
      score: 65,
      summary: "Mock AI analysis completed.",
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