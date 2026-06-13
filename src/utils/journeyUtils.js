const AVATAR_LAB_HASH = "#avatar-lab";
const JOURNEY_START_Z = 2;
const JOURNEY_STEP = 7.5;

// Decide which page should be shown from current URL hash.
function getViewFromHash() {
  return window.location.hash === AVATAR_LAB_HASH ? "avatar" : "resume";
}

// Generate a gentle curved road path from z-position.
function getRoadX(z) {
  return Math.sin((z - JOURNEY_START_Z) * 0.085) * 1.5 + Math.cos((z + 6) * 0.045) * 0.75;
}

// Convert Mixamo animation tracks to match the loaded avatar skeleton naming.
function normalizeMixamoClip(sourceClip, name) {
  if (!sourceClip) {
    return null;
  }

  const clip = sourceClip.clone();
  clip.name = name;
  clip.tracks = clip.tracks
    .filter((track) => !track.name.endsWith(".position"))
    .map((track) => {
      const nextTrack = track.clone();
      nextTrack.name = nextTrack.name.replace(/^mixamorig:?/i, "");
      return nextTrack;
    });

  return clip;
}

// Build ordered journey stops from profile, education, and experience sections.
function buildJourneyStops(t) {
  const educationStops = [...t.education].reverse().map((item) => ({
    section: t.sections.education,
    title: item,
    date: "",
    description: [],
  }));

  const experienceStops = [...t.experiences].reverse().map((item) => ({
    section: t.sections.experience,
    title: item.title,
    date: item.date,
    description: item.description,
  }));

  const stops = [
    {
      section: t.sections.profile,
      title: t.journeyIntroTitle,
      date: t.journeyIntroDate,
      description: [t.avatarIntroLead],
    },
    ...educationStops,
    ...experienceStops,
    {
      section: t.journeyPresentSection,
      title: t.journeyPresentTitle,
      date: t.experiences[0]?.date ?? "",
      description: [t.profileSummary],
    },
  ];

  return stops.map((stop, index) => {
    const z = JOURNEY_START_Z - (stops.length - 1 - index) * JOURNEY_STEP;

    return {
      ...stop,
      index,
      z,
      x: getRoadX(z),
      side: index % 2 === 0 ? -1 : 1,
    };
  });
}

export {
  AVATAR_LAB_HASH,
  JOURNEY_START_Z,
  buildJourneyStops,
  getRoadX,
  getViewFromHash,
  normalizeMixamoClip,
};
