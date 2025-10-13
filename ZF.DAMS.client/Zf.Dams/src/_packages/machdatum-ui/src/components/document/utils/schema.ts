import { AnyZodObject, z, ZodObject, ZodType } from "zod";
import { IInputField, IScreen } from "../../../hooks/useDocument";

export const getAssigneeSchema = (path: string) => {
  const schema = z
    .object(
      {
        users: z
          .array(
            z.object({
              id: z.string(),
            }),
          )
          .optional(),
        groups: z
          .array(
            z.object({
              id: z.string(),
            }),
          )
          .optional(),
        userRoles: z
          .array(
            z.object({
              id: z.string(),
            }),
          )
          .optional(),
      },
      {
        required_error: `${path} is required`,
        invalid_type_error: `${path} is required`,
      },
    )
    .refine(
      (data) => {
        const usersLength = data?.users?.length ?? 0;
        const groupsLength = data?.groups?.length ?? 0;
        const userRolesLength = data?.userRoles?.length ?? 0;

        return usersLength + groupsLength + userRolesLength > 0;
      },
      {
        message: `${path} is required`,
      },
    );

  return schema;
};

const baseDocumentSchema = (
  fields: IInputField[],
  screen?: IScreen,
): { [key: string]: ZodType<any> } => ({
  attachments: z
    .array(
      z.object({
        name: z.string(),
        fileAttachment: z.any(),
      }),
    )
    .optional()
    .nullable()
    .superRefine((data, ctx) => {
      const attachmentFields = fields.filter(
        (field) =>
          field.type === "image-multi" ||
          field.type === "image-single" ||
          field.type === "attachment",
      );

      attachmentFields.forEach((field) => {
        if (screen?.fields[field.name]?.required) {
          const attachmentData = data?.find(
            (ad) => ad.name === `fields.${field.name}`,
          );
          if (!attachmentData) {
            ctx.addIssue({
              message: `${field.label} is required`,
              code: z.ZodIssueCode.custom,
              path: ["fields", field.name],
            });
          }
        }
      });
    }),
  hierarchies: z
    .array(
      z.object({
        name: z.string(),
        hierarchy: z.any(),
      }),
    )
    .optional()
    .nullable(),
  masterData: z
    .array(
      z.object({
        name: z.string(),
        masterData: z.any(),
      }),
    )
    .optional()
    .nullable()
    .superRefine((data, ctx) => {
      const masterFields = fields.filter(
        (field) =>
          field.type === "master-single" || field.type === "master-multi",
      );

      masterFields.forEach((field) => {
        if (screen?.fields[field.name]?.required) {
          const masterData = data?.find(
            (md) => md.name === `fields.${field.name}`,
          );
          if (!masterData) {
            ctx.addIssue({
              message: `${field.label} is required`,
              code: z.ZodIssueCode.custom,
              path: ["fields", field.name],
            });
          }
        }
      });
    }),
  assignees: z
    .array(
      z.object({
        name: z.string(),
        assignee: z.object({
          users: z.array(z.object({ id: z.string() })),
          groups: z.array(z.object({ id: z.string() })),
          userRoles: z.array(z.object({ id: z.string() })),
        }),
      }),
    )
    .optional()
    .nullable()
    .superRefine((data, ctx) => {
      const assigneeFields = fields.filter(
        (field) => field.type === "assignee",
      );

      assigneeFields.forEach((field) => {
        if (screen?.fields[field.name]?.required) {
          const assigneeData = data?.find(
            (md) => md.name === `fields.${field.name}`,
          );
          if (!assigneeData) {
            ctx.addIssue({
              message: `${field.label} is required`,
              code: z.ZodIssueCode.custom,
              path: ["fields", field.name],
            });
          }
        }
      });
    }),
});

export const getDocumentSchema = (
  defaultSchema: {
    [key: string]: ZodType<any>;
  },
  fields: IInputField[],
  screen?: IScreen,
): AnyZodObject => {
  const schema = { ...baseDocumentSchema(fields, screen) };
  Object.keys(defaultSchema).forEach((key) => {
    schema[key] = defaultSchema[key];
  });

  const fieldsSchema: any = { ...defaultSchema["fields"] };
  fields.forEach((field: any) => {
    const isRequired =
      screen?.fields[field.name]?.required || field?.required
        ? field.view === "display-input"
          ? false
          : true
        : false;

    const typeToSchema: { [key: string]: any } = {
      "multi-select": z.any({
        required_error: `${field.label} is required`,
        invalid_type_error: `${field.label} is required`,
      }),
      "single-select": z.any({
        required_error: `${field.label} is required`,
        invalid_type_error: `${field.label} is required`,
      }),
      number: z.number({
        required_error: `${field.label} is required`,
        invalid_type_error: `${field.label} is required`,
      }),
      text: z
        .string({
          required_error: `${field.label} is required`,
          invalid_type_error: `${field.label} is required`,
        })
        .min(isRequired ? 1 : 0, `${field.label} is required`),
      "rich-text": isRequired
        ? z
            .string({
              required_error: `${field.label} is required`,
              invalid_type_error: `${field.label} is required`,
            })
            .refine(
              (val) => {
                try {
                  const hasText = (n: any): boolean =>
                    !!n?.text?.trim() ||
                    (Array.isArray(n?.content) && n.content.some(hasText));

                  return hasText(JSON.parse(val));
                } catch {
                  return false;
                }
              },
              { message: `${field.label} is required` },
            )
        : z.string().optional().nullable(),
      switch: z.boolean({
        required_error: `${field.label} is required`,
        invalid_type_error: `${field.label} is required`,
      }),
      "date-time": z.string().datetime({
        message: `${field.label} is required`,
      }),
      date: z.preprocess(
        (val) => (val === null ? undefined : val),
        z.coerce.date({
          required_error: `${field.label} is required`,
          invalid_type_error: `${field.label} is required`,
        }),
      ),
      hierarchy: z.array(
        z.object(
          {
            name: z.string(),
            hierarchy: z.any(),
          },
          {
            required_error: `${field.label} is required`,
            invalid_type_error: `${field.label} is required`,
          },
        ),
      ),
      "scoring-pattern": z.any(),
    };

    const schema = typeToSchema[field.type];
    if (schema)
      fieldsSchema[field.name] = isRequired
        ? schema
        : schema.optional().nullable();
  });

  if (fields.length > 0) {
    schema["fields"] =
      schema["fields"] instanceof ZodObject
        ? z.object({
            ...schema["fields"]._def.shape(),
            ...fieldsSchema,
          })
        : z.object(fieldsSchema);
  }

  return z.object(schema);
};
