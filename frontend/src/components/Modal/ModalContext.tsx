import React, { createContext, useState } from 'react';

interface ModalContextType {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
    isOpen: false,
    openModal: () => { },
    closeModal: () => { },
});

interface ModalProps {
    children: React.ReactNode
}

const ModalProvider = ({ children } : ModalProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const value = { isOpen, openModal, closeModal };

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
};

export { ModalContext, ModalProvider };