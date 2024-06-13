export class FormSubmitEvent {
    public defaultPrevented = false;
    public preventDefault() {
        this.defaultPrevented = true;
    }
}
