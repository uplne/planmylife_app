import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import classnames from "classnames";

import { BasicButton } from "../Buttons/BasicButton";
import { StatusTypes } from "../../types/status";
import { idType } from "../../types/idtype";

import "./EditableInput.css";

type ComponentProps = {
  className?: string | undefined;
  label?: string;
  title?: string;
  onBlur?: (value: string) => void;
  status?: StatusTypes;
  onFocus?: () => void;
  id: idType;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void | null;
  isInactive?: boolean;
  isCompleted?: boolean;
  hasSaveButton?: boolean;
};

export const EditableInput = forwardRef(
  (
    {
      className = undefined,
      label = "Add task",
      title = "",
      status = StatusTypes.ACTIVE,
      onBlur,
      onFocus,
      onClick,
      isInactive = false,
      isCompleted = false,
      hasSaveButton = true,
    }: ComponentProps,
    ref,
  ) => {
    const [isEditable, setIsEditable] = useState(false);
    const [taskContent, setTaskContent] = useState<string>(title);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const classes = classnames("editable-input w-9/12", className, {
      "editable-input--isCompleted": isCompleted,
    });

    useEffect(() => {
      if (isEditable && inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    });

    useEffect(() => {
      setTaskContent(title);
    }, [title]);

    useImperativeHandle(ref, () => ({
      addFocus: () => {
        setIsEditable(true);
      },
      removeFocus: () => {
        setIsEditable(false);
      },
    }));

    const onSave = () => {
      setIsEditable(false);
      if (onBlur) {
        onBlur(taskContent);
      }
      setTaskContent("");
    };

    const onKeyPress = (e: any) => {
      if (e.key === "Enter") {
        onSave();
      }
    };

    const onChange = (e: any) => {
      const value = e.target.value;
      setTaskContent(value);
    };

    const onClickHandler = (e: React.MouseEvent<HTMLElement>) => {
      if (!isInactive) {
        if (status !== StatusTypes.COMPLETED) {
          if (onClick) {
            onClick(e);
            return;
          }

          setIsEditable(true);
        }
      }
    };

    return (
      <div className={classes}>
        <div className="editable-input__wrapper">
          {!isEditable && (
            <>
              <div className="editable-input__label" onClick={onClickHandler}>
                {!taskContent && label}
                {taskContent && (
                  <div className="editable-input__title">{taskContent}</div>
                )}
              </div>
            </>
          )}
          {isEditable && (
            <div className="editable-input__container">
              <input
                ref={inputRef}
                className="editable-input__input"
                value={taskContent}
                onChange={onChange}
                onBlur={onSave}
                onKeyPress={onKeyPress}
                onFocus={onFocus}
              />
              {hasSaveButton && (
                <BasicButton
                  className="editable-input__button-save"
                  onClick={onSave}
                  small
                >
                  Save
                </BasicButton>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
