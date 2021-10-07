import Button from "../button";
import { useState } from "react";

export function Select<T>({ value, items, renderValue, renderSelectItem, onChange }: {
    items: T[];
    value: T;
    onChange: (item: T) => void;
    renderValue: (value: T) => React.ReactElement;
    renderSelectItem: (item: T) => React.ReactElement;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button className={open ? 'open active' : ''} onClick={items && items.length > 0 ? () => setOpen(!open) : () => { }}>

                <div className={'selected-item'}>
                    {renderValue(value)}
                    ⛛
                </div>

                {open && (
                    <div className="select-popup white-shadow-1">
                        {items.map((item, index) => (
                            <div className={'select-popup-item'} key={`selector-key-${index}`} onClick={() => { onChange(item); setOpen(false); }}>
                                {renderSelectItem(item)}
                            </div>
                        ))}
                    </div>
                )}
            </Button>

        </>
    );
}
