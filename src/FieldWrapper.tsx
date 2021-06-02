import React from "react";
import { WrappedFieldMetaProps, WrappedFieldInputProps } from "redux-form";

interface IProps {
    input: WrappedFieldInputProps;
    meta: WrappedFieldMetaProps;
    label?: string;
    help?: string;
    required?: boolean;
    maxLength?: number;
}

export const FieldWrapper: React.FC<IProps> = (props) => {

    const {
        children,
        input,
        meta,
        label,
        help,
        required,
        maxLength,
    } = props;

    return (
        <div className="field-wrapper">

            { (label || help) &&
                <div className="field-wrapper__head">

                    { label &&
                        <label className="field-wrapper__label" htmlFor={ input.name }>
                            <span className="field-wrapper__label-text">{ label }</span>
                            { required && <small className="field-wrapper__required">(Required)</small> }
                            { maxLength && <small className="field-wrapper__required">(Max Length: { maxLength })</small> }
                        </label>
                    }

                    { help &&
                        <div className="field-wrapper__help">
                            <small>{ help }</small>
                        </div>
                    }
                </div>
            }

            { children }

            { (meta.touched && meta.error) &&
                <small className="field-wrapper__message text-danger">{ meta.error }</small>
            }

            { (meta.touched && meta.warning) &&
                <small className="field-wrapper__message text-warning">{ meta.warning }</small>
            }

        </div>
    );
};
