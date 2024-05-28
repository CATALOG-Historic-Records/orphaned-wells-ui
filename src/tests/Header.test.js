import { render, screen } from '@testing-library/react';
import Header from "../components/Header/Header"
import { HashRouter } from "react-router-dom";

test('test header', () => {

    render( <HashRouter><Header></Header></HashRouter> )

    //test for component elements
    // screen.getByTestId('ListIcon')
})