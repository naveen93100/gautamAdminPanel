import React from 'react';

const jsonData = [ /* Your JSON data here */];

const convertJSONToJSX = (data) => {
    return data.map((element, index) => {
        const { type, props, children } = element;

        if (typeof type === 'string') {
            // If the element is a string type, create the corresponding JSX element
            return React.createElement(type, { key: index, ...props }, convertJSONToJSX(children));
        } else if (Array.isArray(children)) {
            // If the children property is an array, recursively convert it to JSX
            return convertJSONToJSX(children);
        } else {
            // If the children property is a string, return it as text
            return children;
        }
    });
};


export default convertJSONToJSX