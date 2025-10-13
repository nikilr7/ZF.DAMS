import Form, { withForm } from "./Form";
import withModalForm from "./ModalForm";
import withBasicForm from "./BasicForm";
import DeleteDialog from "./DeleteDialog";
import { IFormProps, IFormWrapper, BasicForm } from "./Form";

export type { IFormProps, IFormWrapper };
export { withModalForm, withBasicForm, withForm, DeleteDialog, BasicForm };
export default Form;
