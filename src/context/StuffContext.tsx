import React, { createContext, useState, type SetStateAction, type Dispatch, useMemo } from "react";
import { getLocalStorageItem } from "../utility/LocalStorage";

interface StuffContextType {
    signedIn: boolean;
    setSignedIn: Dispatch<SetStateAction<boolean>>;
}

interface StuffContextProps {
    children: React.ReactNode;
}

const checkIsSignedIn = (): boolean => {
    const user = getLocalStorageItem("user");
    return !!user; 
};

export const StuffContext = createContext<StuffContextType>({
    signedIn: false,
    setSignedIn: () => {}
});

export function StuffProvider({ children }: StuffContextProps) {
    const [signedIn, setSignedIn] = useState<boolean>(() => checkIsSignedIn());

    const contextValue = useMemo(() => ({
        signedIn,
        setSignedIn
    }), [signedIn]);

    return (
        <StuffContext.Provider value={contextValue}>
            {children}
        </StuffContext.Provider>
    );
}