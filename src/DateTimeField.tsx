import React from "react";
import { WrappedFieldProps } from "redux-form";
import { default as moment, Moment } from "moment";
import { DayPickerSingleDateController, DayPickerSingleDateControllerShape } from "react-dates";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import Slider from "@material-ui/core/Slider";
import { dateFormats } from "./utils";

import "react-dates/lib/css/_datepicker.css";
import "react-dates/initialize";
import { FieldWrapper } from "./utils/FieldWrapper";

interface IProps {
    id: string;
    label: string;
    className?: string;
    help?: string;
    required: boolean;
    disabled: boolean;
    clearable: boolean;
    dateFormat?: string;
}

interface IState {
    focused: boolean;
    showCalendar: boolean;
    inputString: string;
    inputMoment: Moment;
    dateFormat: string;
}

type TProps =
        WrappedFieldProps &
        DayPickerSingleDateControllerShape &
        IProps;

export class DateTimeField extends React.Component<TProps, IState> {

    private datePickerNode: Node | undefined;

    constructor(props: TProps) {
        super(props);

        this.state = {
            focused: true,
            showCalendar: false,
            inputString: "",
            inputMoment: null,
            dateFormat: "",
        };

        this.clearInput = this.clearInput.bind(this);
        this.handleOnDateChange = this.handleOnDateChange.bind(this);
        this.handleOnFocusChange = this.handleOnFocusChange.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleInputClick = this.handleInputClick.bind(this);
        this.handleInputFocus = this.handleInputFocus.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.handleHourChange = this.handleHourChange.bind(this);
        this.handleMinuteChange = this.handleMinuteChange.bind(this);
        this.setDatePickerNode = this.setDatePickerNode.bind(this);
        this.toggleCalendar = this.toggleCalendar.bind(this);
        this.displayMinute = this.displayMinute.bind(this);
    }

    public componentDidMount(): void {
        const { input, dateFormat = dateFormats.long } = this.props;
        const inputMoment = moment(input.value);
        const momentIsValid = inputMoment.isValid();

        this.setState({
            inputString: momentIsValid ? inputMoment.format(dateFormat) : "",
            inputMoment: momentIsValid ? inputMoment : null,
            dateFormat,
        });

        document.addEventListener("mousedown", this.handleOutsideClick);
    }

    public componentWillUnmount(): void {
        document.removeEventListener("mousedown", this.handleOutsideClick);
    }

    public render(): JSX.Element {

        const { input, meta, label, className, help, required, disabled, clearable } = this.props;
        const { focused, showCalendar, inputString, inputMoment } = this.state;

        const invalidClass = (meta.touched && meta.error) && `is-invalid` || ``;
        const clearableClass = clearable && `is-clearable` || ``;

        const sliderClass = {
            thumb: `datetime-field__slider-thumb`,
            track: `datetime-field__slider-track`,
        };

        return(
            <div className={ `datetime-field form-group${className ? ` ${className}` : ""}` }>

                <FieldWrapper
                    input={ input }
                    meta={ meta }
                    label={ label }
                    help={ help }
                    required={ required }
                >

                    <div className="datetime-field__input-wrapper">
                        <input
                            id={ `${input.name}-formatted` }
                            value={ inputString }
                            type="text"
                            disabled={ disabled }
                            className={ `datetime-field__input form-control ${invalidClass} ${clearableClass}` }
                            onClick={ this.handleInputClick }
                            onFocus={ this.handleInputFocus }
                            onChange={ this.handleInputChange }
                            onBlur={ this.handleInputBlur }
                        />

                        <input
                            { ...input }
                            id={ input.name }
                            value={ input.value }
                            type="hidden"
                        />

                        { clearable && !!inputString && <button type="button" className="datetime-field__input-clear" onClick={ this.clearInput }>&times;</button> }

                        <div className="datetime-field__input-icons" onClick={ this.handleInputClick } hidden={ clearable && !!inputString }>
                            <FontAwesomeIcon
                                icon={ faCalendar }
                                className="datetime-field__input-calendar"
                            />
                        </div>
                    </div>

                </FieldWrapper>

                <div className="datetime-field__picker-wrapper">
                    {
                        showCalendar

                        &&

                        <div className="datetime-field__picker" ref={ this.setDatePickerNode }>
                            <section className="datetime-field__datepicker">
                                <DayPickerSingleDateController
                                    onDateChange={ this.handleOnDateChange }
                                    onFocusChange={ this.handleOnFocusChange }
                                    focused={ focused }
                                    date={ inputMoment ? inputMoment : moment() }
                                    hideKeyboardShortcutsPanel={ true }
                                    renderMonthElement={ this.renderMonthElement }
                                />
                            </section>

                            <section className="datetime-field__timepicker">
                                <div className="datetime-field__time">
                                    <div className="datetime-field__time-block">
                                        <span>{ inputMoment ? inputMoment.format("h") : 12 }</span>
                                    </div>
                                    <span className="datetime-field__time-colon">:</span>
                                    <div className="datetime-field__time-block">
                                        <span>{ inputMoment ? inputMoment.format("mm") : "00" }</span>
                                    </div>
                                    <span className="datetime-field__time-ampm">{ inputMoment ? inputMoment.format("a") : "am" }</span>
                                </div>
                                <div className="datetime-field__slider">
                                    <span className="datetime-field__slider-value">Hour</span>
                                    <Slider
                                        classes={ sliderClass }
                                        value={ inputMoment ? inputMoment.hour() : 0 }
                                        min={ 0 }
                                        max={ 23 }
                                        step={ 1 }
                                        onChange={ this.handleHourChange }
                                    />
                                </div>
                                <div className="datetime-field__slider">
                                    <span className="datetime-field__slider-value">Minute</span>
                                    <Slider
                                        classes={ sliderClass }
                                        value={ inputMoment ? inputMoment.minute() : 0 }
                                        min={ 0 }
                                        max={ 59 }
                                        step={ 5 }
                                        onChange={ this.handleMinuteChange }
                                    />
                                </div>
                            </section>
                        </div>
                    }
                </div>
            </div>
        );
    }

    private clearInput(): void {
        const { input } = this.props;

        this.setState({
            inputString: "",
            inputMoment: null,
        });

        input.onChange(null);
    }

    private handleOnDateChange(date: Moment): void {
        const { input } = this.props;
        const { dateFormat } = this.state;

        const hour = input.value ? moment(input.value).hour() : 0;
        const minute = input.value ? moment(input.value).minute() : 0;

        const inputMoment = date.hour(hour).minute(minute);

        this.setState({
            inputString: inputMoment.format(dateFormat),
            inputMoment,
        });

        input.onChange(inputMoment.format(dateFormat));
    }

    private handleOnFocusChange(): void {
        this.setState({
            focused: true,
        });
    }

    private handleOutsideClick(event: MouseEvent): void {

        const { input } = this.props;

        const element = event.target as HTMLElement;

        if (this.datePickerNode && !this.datePickerNode.contains(element) && element.id !== input.name) {
            this.toggleCalendar();
        }
    }

    private handleInputClick(): void {
        const { showCalendar } = this.state;

        if (!showCalendar) {
            this.toggleCalendar();
        }
    }

    private handleInputFocus(event: React.FocusEvent): void {
        const { input } = this.props;

        input.onFocus(event, input.name);
    }

    private handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const { input } = this.props;
        const { dateFormat } = this.state;

        const inputString = event.currentTarget.value;
        const inputMoment = inputString.includes("at") ? moment(inputString, dateFormats.long, true) : moment(inputString);
        const momentIsValid = inputMoment.isValid();

        this.setState({
            focused: false,
            showCalendar: false,
            inputString,
            inputMoment: momentIsValid ? inputMoment : null,
        });

        input.onChange(momentIsValid ? inputMoment.format(dateFormat) : inputString);
    }

    private handleInputBlur(): void {
        const { input } = this.props;

        input.onBlur(input.value);
    }

    private handleHourChange(event: React.ChangeEvent, value: number): void {
        const { input } = this.props;
        const { dateFormat } = this.state;
        const inputMoment = moment(input.value).hour(value);

        this.setState({
            inputString: inputMoment.format(dateFormat),
            inputMoment,
        });

        input.onChange(inputMoment.format(dateFormat));
    }

    private handleMinuteChange(event: React.ChangeEvent, value: number): void {
        const { input } = this.props;
        const { dateFormat } = this.state;
        const inputMoment = moment(input.value).minute(value === 60 ? 59 : value);

        this.setState({
            inputString: inputMoment.format(dateFormat),
            inputMoment,
        });

        input.onChange(inputMoment.format(dateFormat));
    }

    private setDatePickerNode(node: Node): void {
        this.datePickerNode = node;
    }

    private toggleCalendar(): void {
        this.setState({
            showCalendar: !this.state.showCalendar,
        });
    }

    private displayMinute(value: number): string | number {
        return value.toString().length === 1 ? `0${ value }` : value;
    }

    private renderMonthElement = ({ month, onMonthSelect, onYearSelect }): JSX.Element => {

        const currentYear = moment().year();
        const years = Array.from(Array(15), (_, i) => currentYear + 10 - i);

        const handleMonthSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
            onMonthSelect(month, event.target.value);
        };

        const handleYearSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
            onYearSelect(month, event.target.value);
        };

        return (
            <div className="datetime-field__month">

                <select
                    className="datetime-field__monthSelect"
                    value={ month.month() }
                    onChange={ handleMonthSelect }
                >
                    {
                        moment.months().map((label, value) => (
                            <option key={ value } value={ value }>{ label }</option>
                        ))
                    }
                </select>

                <select
                    className="datetime-field__yearSelect"
                    value={ month.year() }
                    onChange={ handleYearSelect }
                >
                    {
                        years.map(year => (
                            <option key={ year } value={ year }>{ year }</option>
                        ))
                    }
                </select>

            </div>
        );
    }
}
