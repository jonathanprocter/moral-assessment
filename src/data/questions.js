// MFQ-30 Questions - Verified from official specification (July 2008)
// Questions 6 and 22 are catch questions and are NOT scored

export const questions = [
  // PART 1: Relevance Questions (1-16)
  // Scale: 0=Not at all relevant, 1=Not very relevant, 2=Slightly relevant, 
  //        3=Somewhat relevant, 4=Very relevant, 5=Extremely relevant
  {
    id: 1,
    part: 1,
    text: "Whether or not someone suffered emotionally",
    foundation: "care",
    reverse: false,
    catch: false
  },
  {
    id: 2,
    part: 1,
    text: "Whether or not some people were treated differently than others",
    foundation: "fairness",
    reverse: false,
    catch: false
  },
  {
    id: 3,
    part: 1,
    text: "Whether or not someone's action showed love for his or her country",
    foundation: "loyalty",
    reverse: false,
    catch: false
  },
  {
    id: 4,
    part: 1,
    text: "Whether or not someone showed a lack of respect for authority",
    foundation: "authority",
    reverse: false,
    catch: false
  },
  {
    id: 5,
    part: 1,
    text: "Whether or not someone violated standards of purity and decency",
    foundation: "sanctity",
    reverse: false,
    catch: false
  },
  {
    id: 6,
    part: 1,
    text: "Whether or not someone was good at math",
    foundation: null,
    reverse: false,
    catch: true // CATCH QUESTION - not scored
  },
  {
    id: 7,
    part: 1,
    text: "Whether or not someone cared for someone weak or vulnerable",
    foundation: "care",
    reverse: false,
    catch: false
  },
  {
    id: 8,
    part: 1,
    text: "Whether or not someone acted unfairly",
    foundation: "fairness",
    reverse: false,
    catch: false
  },
  {
    id: 9,
    part: 1,
    text: "Whether or not someone did something to betray his or her group",
    foundation: "loyalty",
    reverse: false,
    catch: false
  },
  {
    id: 10,
    part: 1,
    text: "Whether or not someone conformed to the traditions of society",
    foundation: "authority",
    reverse: false,
    catch: false
  },
  {
    id: 11,
    part: 1,
    text: "Whether or not someone did something disgusting",
    foundation: "sanctity",
    reverse: false,
    catch: false
  },
  {
    id: 12,
    part: 1,
    text: "Whether or not someone was cruel",
    foundation: "care",
    reverse: false,
    catch: false
  },
  {
    id: 13,
    part: 1,
    text: "Whether or not someone was denied his or her rights",
    foundation: "fairness",
    reverse: false,
    catch: false
  },
  {
    id: 14,
    part: 1,
    text: "Whether or not someone showed a lack of loyalty",
    foundation: "loyalty",
    reverse: false,
    catch: false
  },
  {
    id: 15,
    part: 1,
    text: "Whether or not an action caused chaos or disorder",
    foundation: "authority",
    reverse: false,
    catch: false
  },
  {
    id: 16,
    part: 1,
    text: "Whether or not someone acted in a way that God would approve of",
    foundation: "sanctity",
    reverse: false,
    catch: false
  },
  
  // PART 2: Agreement Questions (17-32)
  // Scale: 0=Strongly disagree, 1=Moderately disagree, 2=Slightly disagree,
  //        3=Slightly agree, 4=Moderately agree, 5=Strongly agree
  {
    id: 17,
    part: 2,
    text: "Compassion for those who are suffering is the most crucial virtue.",
    foundation: "care",
    reverse: false,
    catch: false
  },
  {
    id: 18,
    part: 2,
    text: "When the government makes laws, the number one principle should be ensuring that everyone is treated fairly.",
    foundation: "fairness",
    reverse: false,
    catch: false
  },
  {
    id: 19,
    part: 2,
    text: "I am proud of my country's history.",
    foundation: "loyalty",
    reverse: false,
    catch: false
  },
  {
    id: 20,
    part: 2,
    text: "Respect for authority is something all children need to learn.",
    foundation: "authority",
    reverse: false,
    catch: false
  },
  {
    id: 21,
    part: 2,
    text: "People should not do things that are disgusting, even if no one is harmed.",
    foundation: "sanctity",
    reverse: false,
    catch: false
  },
  {
    id: 22,
    part: 2,
    text: "It is better to do good than to do bad.",
    foundation: null,
    reverse: false,
    catch: true // CATCH QUESTION - not scored
  },
  {
    id: 23,
    part: 2,
    text: "One of the worst things a person could do is hurt a defenseless animal.",
    foundation: "care",
    reverse: false,
    catch: false
  },
  {
    id: 24,
    part: 2,
    text: "Justice is the most important requirement for a society.",
    foundation: "fairness",
    reverse: false,
    catch: false
  },
  {
    id: 25,
    part: 2,
    text: "People should be loyal to their family members, even when they have done something wrong.",
    foundation: "loyalty",
    reverse: false,
    catch: false
  },
  {
    id: 26,
    part: 2,
    text: "Men and women each have different roles to play in society.",
    foundation: "authority",
    reverse: false,
    catch: false
  },
  {
    id: 27,
    part: 2,
    text: "I would call some acts wrong on the grounds that they are unnatural.",
    foundation: "sanctity",
    reverse: false,
    catch: false
  },
  {
    id: 28,
    part: 2,
    text: "It can never be right to kill a human being.",
    foundation: "care",
    reverse: false,
    catch: false
  },
  {
    id: 29,
    part: 2,
    text: "I think it's morally wrong that rich children inherit a lot of money while poor children inherit nothing.",
    foundation: "fairness",
    reverse: false,
    catch: false
  },
  {
    id: 30,
    part: 2,
    text: "It is more important to be a team player than to express oneself.",
    foundation: "loyalty",
    reverse: false,
    catch: false
  },
  {
    id: 31,
    part: 2,
    text: "If I were a soldier and disagreed with my commanding officer's orders, I would obey anyway because that is my duty.",
    foundation: "authority",
    reverse: false,
    catch: false
  },
  {
    id: 32,
    part: 2,
    text: "Chastity is an important and valuable virtue.",
    foundation: "sanctity",
    reverse: false,
    catch: false
  }
];

export const scaleLabels = {
  part1: [
    { value: 0, label: "Not at all relevant" },
    { value: 1, label: "Not very relevant" },
    { value: 2, label: "Slightly relevant" },
    { value: 3, label: "Somewhat relevant" },
    { value: 4, label: "Very relevant" },
    { value: 5, label: "Extremely relevant" }
  ],
  part2: [
    { value: 0, label: "Strongly disagree" },
    { value: 1, label: "Moderately disagree" },
    { value: 2, label: "Slightly disagree" },
    { value: 3, label: "Slightly agree" },
    { value: 4, label: "Moderately agree" },
    { value: 5, label: "Strongly agree" }
  ]
};

export const partInstructions = {
  part1: "When you decide whether something is right or wrong, to what extent are the following considerations relevant to your thinking?",
  part2: "Please read the following sentences and indicate your agreement or disagreement."
};
