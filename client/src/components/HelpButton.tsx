'use client'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function HelpButton({ onClick }: { onClick: () => void }) {
    return (
        <button
      className="fixed bottom-5 right-5 flex items-center justify-center px-4 py-2 bg-custom-help-green text-black text-sm font-bold rounded shadow hover:bg-custom-green focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
      onClick={onClick}
    >
      <HelpOutlineIcon className="mr-2 text-lg" />
      Helpline
    </button>
    )
}
