// Resolver to match the database snake_case
export const repoFieldResolvers = {
  latestReleaseTag: (parent: any) => parent.latest_release_tag,
  latestReleaseDate: (parent: any) => parent.latest_release_date,
  latestReleaseId: (parent: any) => parent.latest_release_id,
  latestReleaseNotes: (parent: any) => parent.latest_release_notes,
  seenByUser: (parent: any) => parent.seen_by_user,
};