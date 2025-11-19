// Modal.tsx - Generic reusable modal
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;  // The content to display
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;  // Don't render if closed

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
}