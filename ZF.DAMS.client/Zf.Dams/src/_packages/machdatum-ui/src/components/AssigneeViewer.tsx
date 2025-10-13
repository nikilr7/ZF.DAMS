import {
  Avatar,
  AvatarGroup,
  HStack,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Link,
  Portal,
} from "@chakra-ui/react";
import { IAssignee } from "../hooks/defs";

export default function AssigneeViewer({
  assignee,
}: {
  assignee?: Partial<IAssignee>;
}) {
  const users = assignee ? (
    (assignee.users?.length ?? 0) > 1 ? (
      <Popover trigger="hover" placement="right-start">
        <PopoverTrigger>
          <AvatarGroup gap={4}>
            {assignee.users?.map((u) => (
              <Avatar
                size="xs"
                name={u.displayName ?? (u as any)?.name}
                src={u.profileUrl}
                key={u.id}
                border={"none"}
              />
            ))}
          </AvatarGroup>
        </PopoverTrigger>
        <Portal>
          <PopoverContent w={"fit-content"}>
            <PopoverBody>
              <VStack minWidth={"240px"} spacing={2} align="start">
                {assignee.users?.map((u) => (
                  <HStack justifyContent={"center"} key={u.id}>
                    <Avatar
                      name={u.displayName ?? (u as any)?.name}
                      src={u.profileUrl}
                      size="xs"
                    />
                    <Text>{u.displayName ?? (u as any)?.name}</Text>
                  </HStack>
                ))}
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    ) : (
      assignee.users?.map((u) => (
        <Popover trigger="hover" placement="right-start" key={u.id}>
          <PopoverTrigger>
            <HStack gap={1}>
              <Avatar
                name={u.displayName ?? (u as any)?.name}
                src={u.profileUrl}
                size={"xs"}
              />
            </HStack>
          </PopoverTrigger>
          <Portal>
            <PopoverContent w={"fit-content"}>
              <PopoverBody>
                <HStack align="start">
                  <Avatar
                    name={u.displayName ?? (u as any)?.name}
                    src={u.profileUrl}
                    size={"xs"}
                  />
                  <VStack spacing={0} align="start">
                    <Text fontSize={"md"}>
                      {u.displayName ?? (u as any)?.name}
                    </Text>
                    <Link href={`mailto:${u.email}`}>{u.email}</Link>
                  </VStack>
                </HStack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      ))
    )
  ) : (
    []
  );

  const groups =
    assignee?.groups?.map((g) => <Text key={g.id}>{g.label}</Text>) ?? [];

  const userRoles =
    assignee?.userRoles?.map((r) => <Text key={r.id}>{r.label}</Text>) ?? [];

  return (
    <HStack>
      {userRoles}
      {users}
      {groups}
    </HStack>
  );
}
