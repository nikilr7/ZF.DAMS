import { Flex, Link } from "@chakra-ui/react";
import { ArrowUpRightSquare } from "lucide-react";
import { IDocumentAttachment } from "../../hooks/defs";

export default function DocumentViewer({
  attachments,
  name,
}: {
  attachments?: IDocumentAttachment[];
  name?: string;
}) {
  const documentAttachments = attachments?.filter(
    (a: IDocumentAttachment) => a.name === `fields.${name}`,
  );

  if (documentAttachments && documentAttachments.length > 0) {
    return (
      <>
        {documentAttachments.map((attachment: IDocumentAttachment) => (
          <Flex key={attachment.fileAttachment.key}>
            <Link
              href={`/api/storage/` + attachment.fileAttachment.key}
              target="_blank"
              color={"blue.700"}
              display={"flex"}
              flexDirection={"row"}
              lineHeight={1.1}
              mb={2}
              gap={1}
            >
              {attachment.fileAttachment.fileName}
              <ArrowUpRightSquare size={"0.7rem"} strokeWidth="1.33" />
            </Link>
          </Flex>
        ))}
      </>
    );
  } else return <></>;
}
