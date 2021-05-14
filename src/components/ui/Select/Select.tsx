import React, { useState } from 'react';
import RSelect, { components, Props } from 'react-select';
import cx from 'classnames';
import { GroupTypeBase, OptionTypeBase } from 'react-select/src/types';
import { FixedSizeList as List } from 'react-window';
import classes from './select.module.scss';

export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
}

const height = 35;

const CustomMenuList = (props: any) => {
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const initialOffset = height * options.indexOf(value);

  return (
    <List
      height={maxHeight}
      itemCount={children.length}
      itemSize={height}
      initialScrollOffset={initialOffset}
      width={'100%'}>
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </List>
  );
};

function Select<
  O extends OptionTypeBase = { label: string; value: string },
  M extends boolean = false,
  G extends GroupTypeBase<O> = GroupTypeBase<O>,
>({
  label = '',
  async,
  isMulti,
  className,

  ...props
}: Props<O, M, G> & SelectProps): JSX.Element {
  const [focus, setFocus] = useState(false);

  return (
    <div className={classes.wrapper}>
      <div>{label}</div>
      <RSelect
        {...props}
        className={cx(classes.select, className)}
        placeholder={''}
        isMulti={isMulti}
        hideSelectedOptions={false}
        controlShouldRenderValue={true}
        isClearable={false}
        closeMenuOnSelect={!isMulti}
        components={{
          IndicatorSeparator: null,
          MenuList: CustomMenuList,
          SingleValue(c) {
            return <components.SingleValue {...c} />;
          },
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        styles={{
          control(base) {
            return {
              ...base,
              height: 44,
              borderRadius: 4,
              border: '1px solid #00AFD7',
              backgroundColor: focus ? 'white' : 'transparent',
              ':hover': {
                border: '1px solid #00AFD7',
              },
            };
          },
          container: (base) => ({
            ...base,
          }),
          singleValue: (base) => ({
            ...base,
            // color: '#00AFD7',
            fontWeight: 'bold',
            left: 34,
          }),
          menu(base) {
            return {
              ...base,
              zIndex: 40,
            };
          },
        }}
      />
    </div>
  );
}

Select.defaultProps = {
  label: '',
};

export default Select;
