import { render, screen } from '@testing-library/react';
import Subheader from "../components/Subheader/Subheader"
import { HashRouter } from "react-router-dom";


test('test Subheader', () => {

    render( <HashRouter><Subheader buttonName="New Project"/> </HashRouter>)

    //test for component elements
    
})