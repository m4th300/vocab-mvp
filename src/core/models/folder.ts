export type FolderId = string;

export interface Folder {
  id: FolderId;
  name: string;
  color: string;      // hex soft parmi une petite palette
  parentId?: FolderId;
}
