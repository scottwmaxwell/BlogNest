import { render, screen, cleanup } from '@testing-library/react';
import Card from '../Card';
import Navbar from '../Navbar';
// import { BrowserRouter } from 'react-router-dom';

// Mock react-router-dom's Link
jest.mock('react-router-dom', () => ({
    Link: ({ to, children }: { to: string, children: React.ReactNode }) => (
      <a href={to}>{children}</a>
    ),
  }));

// Card
test('Should render card component', ()=>{

    var blogObj = {
        _id: "asdf", 
        title:"Test title", 
        createdAt:"Date", 
        imageURL:"", 
        author:"authorname", 
        description:"Description"
    }

    render(<Card blog={blogObj}/>)
    const cardElement = screen.getByTestId("card-component")
    expect(cardElement).toBeInTheDocument();
});

// Navbar
test('Should render navbar component', ()=>{

    var blogObj = {
        _id: "asdf", 
        title:"Test title", 
        createdAt:"Date", 
        imageURL:"", 
        author:"authorname", 
        description:"Description"
    }

    render(<Navbar />)
    const navbarElement = screen.getByTestId("navbar-component")
    expect(navbarElement).toBeInTheDocument();
});