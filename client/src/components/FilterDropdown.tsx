import React, {useState, useRef, useEffect} from 'react';

import './style/FilterDropdown.css';

const Dropdown = ({options, id, label, prompt, value, onChange}: any) => {
  const [open, setOpen] = useState(false);
  const [inputOpen, setInputOpen] = useState(false);
  const [query, setQuery] = useState<string>('');
  const ref = useRef(null);

  useEffect(() => {
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const close = (e: any) => {
    setOpen(e && e.target === ref.current);
  };

  const filter = (options: any) => {
    return options.filter(
      (option: any) =>
        option[label].toString().toLowerCase().indexOf(query.toLowerCase()) > -1
    );
  };

  const displayValue = () => {
    if (query.length > 0) return query;
    if (value) return value[label];
    return '';
  };

  return (
    <div className="dropdown">
      <div
        className="control"
        onClick={() => {
          setOpen((prev) => !prev);
          if (inputOpen) setOpen(false);
        }}
      >
        <div className="selected-value">
          <input
            type="number"
            id="valueInput"
            ref={ref}
            placeholder={value ? value[label] : prompt}
            value={displayValue()}
            onChange={(e: any) => {
              setQuery(e.target.value);
              onChange(e.target.value);
            }}
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={`arrow ${open ? 'open' : null}`} />
      </div>
      <div className={`options ${open ? 'open' : null}`}>
        {/* <input onClick={() => setOpen(true)} /> */}
        {filter(options).map((option: any) => {
          return (
            <div
              key={option[id]}
              className={`option ${value === option ? 'selected' : null}`}
              onClick={() => {
                setQuery('');
                onChange(option);
                setOpen(false);
              }}
            >
              {option[label]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dropdown;
