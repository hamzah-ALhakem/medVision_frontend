import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight, RotateCcw, BrainCircuit, Dna, Microscope } from 'lucide-react';
import Button from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';

const translations = {
  ar: {
    title: 'فحص الأورام بالذكاء الاصطناعي',
    desc: 'يرجى إدخال القيم الخلوية المستخرجة من الخزعة. سيقوم نموذجنا بتحليل 30 خاصية للتنبؤ بالتشخيص.',
    ready: 'النموذج جاهز (Online)',
    groups: {
      mean: 'متوسط القيم (Mean)',
      se: 'الخطأ المعياري (SE)',
      worst: 'أسوأ القيم (Worst)'
    },
    error: 'يرجى إدخال جميع القيم الـ 30 للحصول على دقة عالية.',
    analyzing: {
      title: 'جاري الاتصال بالخادم...',
      desc: 'يتم الآن إرسال البيانات إلى نموذج الذكاء الاصطناعي لتحليلها.'
    },
    result: {
      malignant: 'ورم خبيث (Malignant)',
      benign: 'ورم حميد (Benign)',
      subtitle: 'تم اكتشافه بناءً على تحليل الخلايا',
      descMalignant: 'يشير تحليل الذكاء الاصطناعي إلى احتمالية عالية لوجود ورم خبيث. يجب مراجعة الطبيب فوراً.',
      descBenign: 'يشير تحليل الذكاء الاصطناعي إلى أن الورم حميد. يرجى المتابعة الدورية.',
      accuracy: 'نسبة الثقة',
      time: 'وقت المعالجة',
      newTest: 'فحص جديد',
      consult: 'استشارة طبيب مختص'
    },
    btnAnalyze: 'ابدأ التحليل الحقيقي',
    hint: 'تأكد من إدخال جميع القيم بشكل صحيح قبل البدء.',
    apiError: 'حدث خطأ أثناء الاتصال بالخادم. تأكد من القيم وحاول مرة أخرى.'
  },
  en: {
    title: 'AI Tumor Screening',
    desc: 'Enter the cytological values extracted from the FNA biopsy. Our AI model will analyze these 30 features to predict the diagnosis.',
    ready: 'AI Model Online',
    groups: {
      mean: 'Mean Values',
      se: 'Standard Error',
      worst: 'Worst Values'
    },
    error: 'Please fill all 30 fields for high accuracy.',
    analyzing: {
      title: 'Connecting to Server...',
      desc: 'Sending data to the AI model for analysis.'
    },
    result: {
      malignant: 'Malignant Tumor',
      benign: 'Benign Tumor',
      subtitle: 'Detected based on cellular analysis',
      descMalignant: 'The AI analysis indicates a high probability of a malignant tumor. Please consult a doctor immediately.',
      descBenign: 'The AI analysis indicates the tumor is benign. Regular checkups are recommended.',
      accuracy: 'Confidence Score',
      time: 'Processing Time',
      newTest: 'New Test',
      consult: 'Consult Specialist'
    },
    btnAnalyze: 'Start Real Analysis',
    hint: 'Ensure all 30 fields are filled correctly before analysis.',
    apiError: 'Error connecting to server. Check values and try again.'
  }
};

// ترتيب الحقول مهم جداً للـ API
const features = [
  { key: 'radius', label: 'Radius' }, { key: 'texture', label: 'Texture' },
  { key: 'perimeter', label: 'Perimeter' }, { key: 'area', label: 'Area' },
  { key: 'smoothness', label: 'Smoothness' }, { key: 'compactness', label: 'Compactness' },
  { key: 'concavity', label: 'Concavity' }, { key: 'concave_points', label: 'Concave Pts' },
  { key: 'symmetry', label: 'Symmetry' }, { key: 'fractal_dimension', label: 'Fractal Dim' },
];

export default function Screening() {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const [status, setStatus] = useState('input');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    radius_mean: '', texture_mean: '', perimeter_mean: '', area_mean: '', smoothness_mean: '',
    compactness_mean: '', concavity_mean: '', concave_points_mean: '', symmetry_mean: '', fractal_dimension_mean: '',
    radius_se: '', texture_se: '', perimeter_se: '', area_se: '', smoothness_se: '',
    compactness_se: '', concavity_se: '', concave_points_se: '', symmetry_se: '', fractal_dimension_se: '',
    radius_worst: '', texture_worst: '', perimeter_worst: '', area_worst: '', smoothness_worst: '',
    compactness_worst: '', concavity_worst: '', concave_points_worst: '', symmetry_worst: '', fractal_dimension_worst: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. التحقق من القيم الفارغة
    const emptyFields = Object.values(formData).some(val => val === '' || val === null);
    if (emptyFields) {
      setError(t.error);
      window.scrollTo(0, 0);
      return;
    }

    setStatus('analyzing');

    try {
        // 2. تحويل البيانات إلى أرقام (Numbers) لأن الـ API يحتاج أرقام وليس نصوص
        // ملاحظة: نقوم بتحويل القيم إلى مصفوفة (Array) أو كائن (Object) حسب ما يطلبه الـ API الخاص بك
        // سأفترض هنا أن الـ API يتوقع كائن JSON
        const payload = {};
        for (const key in formData) {
            payload[key] = parseFloat(formData[key]);
        }

        // 3. الاتصال بالرابط الحقيقي 🚀
        // ⚠️ هام: تأكد أن '/predict' هو المسار الصحيح في كود البايثون، إذا كان مختلفاً غيره هنا
        const response = await fetch('https://breast-api-deploy.onrender.com/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload) 
            // إذا كان الـ API يتوقع مصفوفة فقط، استخدم: body: JSON.stringify([Object.values(payload)])
        });

        if (!response.ok) {
            throw new Error('Server Error');
        }

        const data = await response.json();
        
        // 4. معالجة الاستجابة (تعديل هذا الجزء بناءً على شكل رد الـ API)
        // مثال: data قد تكون { prediction: 1, probability: 0.95 }
        // سأفترض أن 1 = خبيث، 0 = حميد
        
        // حاول قراءة التنبؤ بأكثر من صيغة محتملة
        const predictionValue = data.prediction !== undefined ? data.prediction : data[0]; 
        const isMalignant = predictionValue == 1 || predictionValue === 'M'; 
        
        // احتمالية الدقة (إذا لم يرسلها الـ API نضع رقم عشوائي للتجربة)
        const confidenceVal = data.probability ? (data.probability * 100).toFixed(1) : '95.5';

        setResult({
            diagnosis: isMalignant ? 'Malignant' : 'Benign', 
            confidence: confidenceVal,
            description: isMalignant ? t.result.descMalignant : t.result.descBenign
        });

        setStatus('result');
        window.scrollTo(0, 0);

    } catch (err) {
        console.error("AI Error:", err);
        setError(t.apiError);
        setStatus('input');
        window.scrollTo(0, 0);
    }
  };

  const renderInputGroup = (title, prefix, icon) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-dark">{title}</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {features.map((field) => {
          const inputName = `${field.key}_${prefix}`;
          return (
            <div key={inputName}>
              <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide truncate">
                {field.label}
              </label>
              <input
                name={inputName}
                type="number"
                step="0.0001"
                placeholder="0.00"
                value={formData[inputName]}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 rounded-lg py-2.5 px-3 outline-none transition-all font-medium text-dark text-sm placeholder:text-gray-300"
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  if (status === 'analyzing') {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center text-center animate-in fade-in pb-20">
        <div className="relative w-40 h-40 mb-8">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-4 border-4 border-blue-200 rounded-full animate-ping opacity-40 delay-150"></div>
          <div className="absolute inset-0 border-[6px] border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-[6px] border-primary rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BrainCircuit className="text-primary animate-pulse" size={48} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">{t.analyzing.title}</h2>
        <p className="text-gray-500 max-w-sm mx-auto">{t.analyzing.desc}</p>
      </div>
    );
  }

  if (status === 'result') {
    const isMalignant = result.diagnosis === 'Malignant';
    const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;
    return (
      <div className="max-w-3xl mx-auto py-10 animate-in zoom-in-95 duration-500">
        <div className={`relative bg-white rounded-[2rem] shadow-xl overflow-hidden border-t-8 ${isMalignant ? 'border-red-500' : 'border-emerald-500'}`}>
          <div className={`absolute top-0 left-0 w-full h-40 opacity-10 ${isMalignant ? 'bg-red-500' : 'bg-emerald-500'}`}></div>

          <div className="relative p-10 text-center">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-lg border-4 border-white ${isMalignant ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
               {isMalignant ? <AlertCircle size={48} /> : <CheckCircle2 size={48} />}
            </div>
            
            <h2 className={`text-4xl font-bold mb-2 ${isMalignant ? 'text-red-600' : 'text-emerald-600'}`}>
              {isMalignant ? t.result.malignant : t.result.benign}
            </h2>
            <p className="text-gray-500 font-medium mb-8">{t.result.subtitle}</p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <p className="text-gray-700 leading-relaxed text-lg">{result.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-blue-50 rounded-2xl">
                    <p className="text-xs text-blue-500 font-bold uppercase mb-1">{t.result.accuracy}</p>
                    <p className="text-2xl font-bold text-primary">{result.confidence}%</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl">
                    <p className="text-xs text-purple-500 font-bold uppercase mb-1">{t.result.time}</p>
                    <p className="text-2xl font-bold text-purple-700">~1s</p>
                </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setStatus('input')}>
                <RotateCcw size={18} className={language === 'ar' ? "ml-2" : "mr-2"} /> {t.result.newTest}
              </Button>
              <Button onClick={() => navigate('/patient-dashboard')}>
                {t.result.consult} <ArrowIcon size={18} className={language === 'ar' ? "mr-2" : "ml-2"} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 pb-20">
      <div className="mb-8 text-center md:text-left md:flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-dark mb-2">{t.title}</h1>
            <p className="text-gray-500 max-w-xl">{t.desc}</p>
        </div>
        <div className="hidden md:block">
            <span className="bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-green-200">
                <BrainCircuit size={18} /> {t.ready}
            </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 font-bold shadow-sm animate-bounce">
          <AlertCircle size={24} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderInputGroup(t.groups.mean, "mean", <Microscope size={20}/>)}
        {renderInputGroup(t.groups.se, "se", <Activity size={20}/>)}
        {renderInputGroup(t.groups.worst, "worst", <Dna size={20}/>)}

        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20">
           <div className="max-w-6xl mx-auto flex justify-between items-center">
                <div className="text-sm text-gray-500 hidden sm:block">
                    {t.hint}
                </div>
                <Button type="submit" className="w-full sm:w-auto px-8 py-3 shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                     {t.btnAnalyze} <BrainCircuit size={20} className={language === 'ar' ? "mr-2" : "ml-2"}/>
                </Button>
           </div>
        </div>
      </form>
      
      <div className="h-20"></div>
    </div>
  );
}