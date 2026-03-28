// Normative data from MFQ-30 specification
// Average scores from moderate American sample

export const averageScores = {
  care: 20.2,
  fairness: 20.5,
  loyalty: 16.0,
  authority: 16.5,
  sanctity: 12.6
};

export const foundationNames = {
  care: "Care/Harm",
  fairness: "Fairness/Cheating",
  loyalty: "Loyalty/Betrayal",
  authority: "Authority/Subversion",
  sanctity: "Sanctity/Degradation"
};

export const foundationDescriptions = {
  care: "Caring for others and preventing harm. Compassion and protection of the vulnerable.",
  fairness: "Justice, equal treatment, and reciprocity. Fairness violations and rights.",
  loyalty: "Group loyalty and commitment. Betrayal as a moral violation.",
  authority: "Respect for authority, tradition, and social order.",
  sanctity: "Purity, sanctity, and the sacred. Sensitivity to degradation and contamination."
};

// Interpretation text based on score ranges (0-30 scale)
export const interpretations = {
  care: {
    high: "You place strong emphasis on caring for others and preventing harm. Compassion and protection of the vulnerable are central to your moral worldview.",
    moderate: "You value care and harm prevention as one of several important moral considerations.",
    low: "Preventing harm may be less central to your moral judgments compared to other considerations."
  },
  fairness: {
    high: "Justice and equal treatment are paramount in your moral reasoning. You're strongly attuned to fairness violations and rights.",
    moderate: "Fairness is an important but not dominant factor in your moral thinking.",
    low: "You may weigh other moral considerations more heavily than strict fairness or equality."
  },
  loyalty: {
    high: "Group loyalty and commitment strongly influence your moral judgments. Betrayal is seen as a serious moral violation.",
    moderate: "You balance loyalty concerns with other moral considerations.",
    low: "Individual autonomy may take precedence over group loyalty in your moral framework."
  },
  authority: {
    high: "Respect for authority, tradition, and social order are important moral values for you.",
    moderate: "You recognize the role of authority while maintaining some skepticism.",
    low: "You may question traditional authority structures and hierarchies in your moral reasoning."
  },
  sanctity: {
    high: "Purity, sanctity, and the sacred play significant roles in your moral judgments. You may be sensitive to degradation and contamination.",
    moderate: "Sanctity considerations factor into your moral thinking alongside other foundations.",
    low: "Your moral judgments may focus more on tangible harm and fairness than on purity concerns."
  }
};

// Score thresholds for interpretation
export const scoreThresholds = {
  high: 24,
  moderate: 15
};

export const politicalPatternNote = "Research shows that self-identified liberals tend to score higher on Care/Harm and Fairness/Reciprocity, while scoring lower on Loyalty, Authority, and Sanctity. Conservatives tend to score more evenly across all five foundations. These are general patterns with significant individual variation.";
