import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    sidebarOpen: boolean;
    theme: 'dark' | 'light';
    globalLoading: boolean;
    toastQueue: { id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }[];
    modalOpen: string | null;
}

const initialState: UIState = {
    sidebarOpen: true,
    theme: 'dark',
    globalLoading: false,
    toastQueue: [],
    modalOpen: null,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen(state, action: PayloadAction<boolean>) {
            state.sidebarOpen = action.payload;
        },
        setTheme(state, action: PayloadAction<'dark' | 'light'>) {
            state.theme = action.payload;
        },
        setGlobalLoading(state, action: PayloadAction<boolean>) {
            state.globalLoading = action.payload;
        },
        addToast(state, action: PayloadAction<Omit<UIState['toastQueue'][0], 'id'>>) {
            state.toastQueue.push({
                id: Date.now().toString(),
                ...action.payload,
            });
        },
        removeToast(state, action: PayloadAction<string>) {
            state.toastQueue = state.toastQueue.filter(t => t.id !== action.payload);
        },
        openModal(state, action: PayloadAction<string>) {
            state.modalOpen = action.payload;
        },
        closeModal(state) {
            state.modalOpen = null;
        },
    },
});

export const {
    toggleSidebar,
    setSidebarOpen,
    setTheme,
    setGlobalLoading,
    addToast,
    removeToast,
    openModal,
    closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
