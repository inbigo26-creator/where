# Security Specification for '주인님 어디 계세요'

## 1. Data Invariants
- A `LostItem` must be created by a user with the `teacher` role (enforced via Firestore rules looking up the `users` collection).
- `privateNote` field is sensitive and MUST only be readable by users with the `teacher` role.
- Students can read all fields of a `LostItem` EXCEPT `privateNote`.
- Only teachers can `create`, `update`, or `delete` items.
- User profiles can only be written by the owner.
- Roles can only be modified by the owner (for this demo's simplicity, but in production this should be admin-only).

## 2. The "Dirty Dozen" Payloads (Attacks)
1. **Student Role Spoofing**: A student attempts to update their own role to 'teacher' in their profile.
2. **Hidden Note Leak**: A student attempts to read a `LostItem` document and access the `privateNote` field.
3. **Ghost Item Creation**: A student attempts to `addDoc` to the `lostItems` collection.
4. **Unauthorized Update**: A student attempts to update the `status` of an item to 'collected'.
5. **Unauthorized Deletion**: A student attempts to delete an item.
6. **Path Poisoning**: An attacker attempts to create a document with a 1.5KB string as an ID.
7. **Identity Theft**: A user attempts to create a `LostItem` with a `creatorId` that is not their own.
8. **PII Leak**: A user attempts to list all users and their emails.
9. **Timestamp Manipulation**: A user attempts to set a future `createdAt` date on an item.
10. **State Skipping**: A teacher attempts to update an item to a non-existent status.
11. **Size Exhaustion**: A user attempts to upload a 1MB string in the `name` field of an item.
12. **Orphaned Record**: A user attempts to create a `LostItem` referring to a non-existent project (not applicable here, but generally checked).

## 3. Test Runner
We will implement the rules to block these.
