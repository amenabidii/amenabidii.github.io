const greetings = [
  ["tn", /^(?:[3a]aslema|3aslama|aslema|asslema|asslemaaa|ahla bik|salem)$/u, "3aslema! Ena Amenos. Chnowa t7eb ta3ref 3la Amen?"],
  ["ar-TN", /^(?:عسلامة|عسلامه|عسلاما)$/u, "عسلامة! أنا آمينوس. شنوة تحب تعرف على آمن؟"],
  ["ar-EG", /^(?:ازيك|إزيك|ازيّك|اهلا|أهلا|أهلاً|السلام عليكم)$/u, "أهلاً! أنا أمينوس. تحب تعرف إيه عن آمن؟"],
  ["fr", /^(?:bonjour|salut|bonsoir|coucou)$/u, "Salut ! Moi, c’est Amenos. Qu’aimerais-tu savoir sur Amen ?"],
  ["en", /^(?:hi|hello|hey|good morning|good evening)$/u, "Hi! I’m Amenos. What would you like to know about Amen?"]
];

export function greetingReply(text, preference) {
  const normalized = text.normalize("NFKC").toLowerCase().replace(/[\p{P}\p{S}]/gu, " ").trim().replace(/\s+/g, " ");
  const match = greetings.find(([, pattern]) => pattern.test(normalized));
  if (!match) return null;
  return (greetings.find(([lang]) => lang === preference) || match)[2];
}
