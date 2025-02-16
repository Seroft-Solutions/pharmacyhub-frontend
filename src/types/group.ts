// Group entity
interface Group {
  id: string;
  name: string;
  parentGroupId: string | null; // Reference to parent group, null if it's a top-level group
  path: string; // Full path of the group hierarchy, e.g., "/topGroup/businessGroup"
}