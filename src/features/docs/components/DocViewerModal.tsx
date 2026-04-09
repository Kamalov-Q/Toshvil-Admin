import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
    ExternalLink, 
    Download, 
    FileText, 
    FileSpreadsheet, 
    FileBox, 
    File as FileIcon,
    Loader2,
    Maximize2,
    Minimize2,
    Calendar,
    Tag,
    Clock,
    X,
    ChevronLeft
} from 'lucide-react';
import { getFileUrl, formatDate } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { type Doc } from '@/types/docs.types';

interface DocViewerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    doc: Doc;
}

export default function DocViewerModal({
    open,
    onOpenChange,
    doc,
}: DocViewerModalProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    const fullUrl = getFileUrl(doc.url);
    const extension = doc.url.split('.').pop()?.toLowerCase() || '';
    const isLocalhost = fullUrl.includes('localhost');
    
    const isOffice = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension);
    const isPdf = extension === 'pdf';

    // Office Online Viewer URL
    const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fullUrl)}`;

    useEffect(() => {
        if (open) {
            setIsLoading(true);
        }
    }, [open, doc.url]);

    const getFileIcon = (lg = false) => {
        const size = lg ? "w-12 h-12" : "w-6 h-6";
        switch (extension) {
            case 'pdf': return <FileText className={cn(size, "text-red-500")} />;
            case 'doc':
            case 'docx': return <FileText className={cn(size, "text-blue-500")} />;
            case 'xls':
            case 'xlsx': return <FileSpreadsheet className={cn(size, "text-green-500")} />;
            case 'ppt':
            case 'pptx': return <FileBox className={cn(size, "text-orange-500")} />;
            default: return <FileIcon className={cn(size, "text-gray-500")} />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className={cn(
                    "flex flex-col p-0 overflow-hidden transition-all duration-500 ease-in-out border-none",
                    isFullscreen 
                        ? "fixed inset-0 m-0 w-screen h-screen max-w-none rounded-none z-[100]" 
                        : "w-[95vw] sm:max-w-[90vw] lg:max-w-7xl h-[92vh] rounded-2xl shadow-[0_0_80px_-20px_rgba(0,0,0,0.3)]"
                )}
            >
                <div className="flex h-full overflow-hidden bg-white">
                    {/* Premium Sidebar - Metadata */}
                    {!isFullscreen && (
                        <aside className="hidden lg:flex w-[340px] flex-col bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white border-r border-white/5 overflow-y-auto shrink-0 relative group/sidebar">
                            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            
                            <div className="p-10 border-b border-white/5 relative z-10">
                                <div className="mb-8 inline-flex p-5 bg-white/10 rounded-3xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-500">
                                    {getFileIcon(true)}
                                </div>
                                <h2 className="text-2xl font-black leading-[1.2] tracking-tight mb-3 text-white drop-shadow-sm">
                                    {doc.titleUz}
                                </h2>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:animate-ping" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                        {extension} format
                                    </span>
                                </div>
                            </div>

                            <div className="p-10 space-y-10 flex-1 relative z-10">
                                <section className="space-y-6">
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <div className="w-6 h-[1.5px] bg-blue-500/50 rounded-full" />
                                        <h3 className="text-[11px] uppercase font-black text-gray-500 tracking-[0.15em]">Ma'lumotlar</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="group/item flex items-center gap-4">
                                            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 group-hover/item:border-blue-500/30 transition-colors">
                                                <Tag className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Kategoriya</p>
                                                <p className="text-[15px] font-bold text-gray-200 group-hover/item:text-white transition-colors">
                                                    {doc.category?.nameUz || 'Noma\'lum'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="group/item flex items-center gap-4">
                                            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 group-hover/item:border-teal-500/30 transition-colors">
                                                <Calendar className="w-5 h-5 text-teal-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Sana</p>
                                                <p className="text-[15px] font-bold text-gray-200 group-hover/item:text-white transition-colors">
                                                    {doc.createdAt ? formatDate(doc.createdAt) : '--.--.----'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="group/item flex items-center gap-4">
                                            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 group-hover/item:border-purple-500/30 transition-colors">
                                                <Clock className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Yangilandi</p>
                                                <p className="text-[15px] font-bold text-gray-200 group-hover/item:text-white transition-colors">
                                                    {doc.updatedAt ? formatDate(doc.updatedAt) : formatDate(doc.createdAt || '')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {doc.descriptionUz && (
                                    <section>
                                        <div className="flex items-center gap-2.5 mb-4">
                                            <div className="w-6 h-[1.5px] bg-blue-500/50 rounded-full" />
                                            <h3 className="text-[11px] uppercase font-black text-gray-500 tracking-[0.15em]">Tavsif</h3>
                                        </div>
                                        <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/10 relative overflow-hidden group/tavsif">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/40" />
                                            <p className="text-sm text-gray-300 leading-relaxed font-medium italic opacity-90 group-hover/tavsif:opacity-100 transition-opacity">
                                                "{doc.descriptionUz}"
                                            </p>
                                        </div>
                                    </section>
                                )}
                            </div>

                            <div className="p-8 mt-auto bg-black/40 border-t border-white/5 relative z-10">
                                <Button
                                    size="lg"
                                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl gap-3 font-black tracking-wide shadow-[0_10px_30px_-10px_rgba(37,99,235,0.4)] hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all duration-300 group"
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = fullUrl;
                                        link.download = doc.titleUz;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                >
                                    <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Yuklab olish
                                </Button>
                            </div>
                        </aside>
                    )}

                    {/* Main Viewing Area */}
                    <div className="flex-1 flex flex-col bg-white overflow-hidden">
                        {/* Elite Top Header */}
                        <header className="h-20 px-8 border-b flex items-center justify-between shrink-0 bg-white/95 backdrop-blur-xl z-20">
                            <div className="flex items-center gap-6">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="lg:hidden h-12 w-12 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                                    onClick={() => onOpenChange(false)}
                                >
                                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                                </Button>
                                <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50">
                                    <div className="relative">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping absolute inset-0 opacity-40"></div>
                                    </div>
                                    <span className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                                        Hujjatni ko'rish
                                        <span className="w-[1px] h-3 bg-blue-200" />
                                        <span className="text-blue-500/70 lowercase font-bold font-mono">.v2.0</span>
                                    </span>
                                </div>
                                <div className="flex flex-col lg:hidden">
                                    <h1 className="text-base font-black text-gray-900 truncate max-w-[200px] leading-tight">
                                        {doc.titleUz}
                                    </h1>
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-0.5">
                                        {extension} preview
                                    </p>
                                </div>
                            </div>

                                <div className="flex items-center gap-4">
                                {isLocalhost && isOffice && (
                                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl shadow-sm">
                                        <div className="p-1 px-2 bg-amber-500 text-white rounded-lg text-[10px] font-black uppercase">Localhost</div>
                                        <span className="text-[11px] font-bold text-amber-900 tracking-tight">Ochiq URL kutilmoqda (Office Viewer)</span>
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 border border-gray-100 rounded-2xl ml-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 text-gray-500 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-xl transition-all duration-300"
                                        onClick={() => setIsFullscreen(!isFullscreen)}
                                        title="To'liq ekran"
                                    >
                                        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 text-gray-500 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-xl transition-all duration-300"
                                        onClick={() => window.open(fullUrl, '_blank')}
                                        title="Tashqarida ochish"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-md rounded-xl transition-all duration-300"
                                        onClick={() => onOpenChange(false)}
                                        title="Yopish"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </header>

                        {/* Immersive Preview Chamber */}
                        <main className="flex-1 relative bg-gray-100/50 flex flex-col p-6 sm:p-10 lg:p-14 overflow-hidden">
                            {/* Cinematic Loading Overlay */}
                            {isLoading && !isLocalhost && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl animate-in fade-in duration-500">
                                    <div className="relative mb-8 scale-110">
                                        <div className="absolute inset-0 blur-3xl bg-blue-500/20 scale-150 animate-pulse"></div>
                                        <div className="relative p-10 bg-white rounded-[40px] shadow-2xl border border-gray-100 flex items-center justify-center">
                                            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                                        </div>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Hujjat ishlanmoqda</h3>
                                        <div className="flex items-center gap-1.5 justify-center">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-600/30 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex-1 bg-white rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent h-20 pointer-events-none z-10 opacity-70" />
                                
                                {isOffice && !isLocalhost ? (
                                    <iframe
                                        src={officeUrl}
                                        className="w-full h-full border-none bg-white opacity-0 transition-opacity duration-1000"
                                        title="Office Document Viewer"
                                        onLoad={(e) => {
                                            setIsLoading(false);
                                            (e.target as HTMLIFrameElement).style.opacity = '1';
                                        }}
                                    />
                                ) : isPdf ? (
                                    <iframe
                                        src={`${fullUrl}#toolbar=0`}
                                        className="w-full h-full border-none bg-white opacity-0 transition-opacity duration-1000"
                                        title="PDF Viewer"
                                        onLoad={(e) => {
                                            setIsLoading(false);
                                            (e.target as HTMLIFrameElement).style.opacity = '1';
                                        }}
                                    />
                                ) : isOffice && isLocalhost ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-10 text-center p-16 bg-[#fafbfc]">
                                        <div className="relative group/localhost">
                                            <div className="absolute inset-0 blur-[60px] bg-amber-500/10 rounded-full scale-150 transition-transform duration-1000"></div>
                                            <div className="relative p-12 bg-white rounded-[50px] shadow-2xl border border-amber-100/50 flex items-center justify-center transform group-hover/localhost:translate-y-[-8px] transition-transform duration-500">
                                                <div className="absolute -top-3 -right-3 px-4 py-1.5 bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Local Preview</div>
                                                {getFileIcon(true)}
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4 max-w-lg">
                                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight uppercase">
                                                Dastlabki ko'rinish kutilmoqda
                                            </h3>
                                            <p className="text-gray-500 font-bold text-lg leading-relaxed px-4">
                                                Siz hozirda <span className="text-amber-600 font-black">localhost</span> muhitidasiz. Microsoft Office oyna orqali ko'rish uchun hujjat ochiq internetda bo'lishi kerak.
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md">
                                            <Button
                                                size="lg"
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = fullUrl;
                                                    link.download = doc.titleUz;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                                className="flex-1 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-blue-600/60 font-black tracking-wide transition-all duration-300 gap-3"
                                            >
                                                <Download className="w-5 h-5 shadow-sm" />
                                                Yuklab olish
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full gap-10 text-center p-16 bg-[#fafbfc]">
                                        <div className="relative group/no-viewer">
                                            <div className="absolute inset-0 blur-[50px] bg-blue-500/10 rounded-full scale-150 group-hover/no-viewer:scale-[1.8] transition-transform duration-1000"></div>
                                            <div className="relative p-12 bg-white rounded-[50px] shadow-2xl border border-gray-100/50 flex items-center justify-center transform group-hover/no-viewer:translate-y-[-8px] transition-transform duration-500">
                                                <div className="absolute -top-3 -right-3 px-4 py-1.5 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Unsupported</div>
                                                <FileIcon className="w-24 h-24 text-gray-200 group-hover/no-viewer:text-blue-200 transition-colors duration-500" />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4 max-w-lg">
                                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight uppercase">
                                                Ko'rish imkoniyati yo'q
                                            </h3>
                                            <p className="text-gray-500 font-bold text-lg leading-relaxed px-4">
                                                Ushbu <span className="text-blue-600 underline underline-offset-4 decoration-2">.{extension.toUpperCase()}</span> hujjat formatini brauzer interfeysida ko'rsatib bo'lmaydi.
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={() => window.open(fullUrl, '_blank')}
                                                className="flex-1 h-16 rounded-3xl border-gray-200 font-black tracking-wide hover:bg-white hover:shadow-xl transition-all duration-300 gap-3"
                                            >
                                                <ExternalLink className="w-5 h-5 text-blue-600" />
                                                Tashqi oyna
                                            </Button>
                                            <Button
                                                size="lg"
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = fullUrl;
                                                    link.download = doc.titleUz;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                                className="flex-1 h-16 bg-[#0f172a] hover:bg-black text-white rounded-3xl shadow-[0_20px_40px_-10px_rgba(15,23,42,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(0,0,0,0.5)] font-black tracking-wide transition-all duration-300 gap-3"
                                            >
                                                <Download className="w-5 h-5" />
                                                Yuklash
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Add these animations to your globals.css if not present
// @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
// .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
// @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
// .animate-bounce-subtle { animation: bounce-subtle 2s infinite ease-in-out; }
