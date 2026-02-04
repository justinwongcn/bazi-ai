import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InputPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    sex: '1', // 1: Male, 0: Female
    dateType: '1', // 1: Solar, 0: Lunar
    birthDate: '1990-01-01T00:00',
    location: '未知地 北京时间',
    isDst: false,
    isTrueSolar: false,
    isEarlyRat: false
  });

  const handleSubmit = () => {
    // In a real app, we would process the date to calculate Bazi here or send to backend.
    // For now, we just navigate to result page with mock params or just plain navigation.
    // The existing ResultPage uses mocked data regardless of params, but this completes the flow.
    const query = new URLSearchParams({
      name: formData.name,
      sex: formData.sex,
      date: formData.birthDate,
      // ... other params
    }).toString();
    
    navigate(`/result?${query}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4 font-sans text-gray-900">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#b2955d] text-white p-4 text-center">
          <h1 className="text-xl font-bold">八字排盘</h1>
        </div>

        {/* Form Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-6">
            
            {/* Name */}
            <div className="flex items-center border-b border-gray-200 py-2">
              <label className="w-24 text-gray-600 font-medium">命主姓名</label>
              <input 
                type="text" 
                placeholder="请输入姓名"
                className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Gender */}
            <div className="flex items-center border-b border-gray-200 py-2">
              <label className="w-24 text-gray-600 font-medium">性别</label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="sex" 
                    value="1" 
                    checked={formData.sex === '1'} 
                    onChange={e => setFormData({...formData, sex: e.target.value})}
                    className="mr-2 accent-[#b2955d]"
                  />
                  <span>男</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="sex" 
                    value="0" 
                    checked={formData.sex === '0'} 
                    onChange={e => setFormData({...formData, sex: e.target.value})}
                    className="mr-2 accent-[#b2955d]"
                  />
                  <span>女</span>
                </label>
              </div>
            </div>

            {/* Date Type */}
            <div className="flex items-center border-b border-gray-200 py-2">
              <label className="w-24 text-gray-600 font-medium">历法</label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="dateType" 
                    value="1" 
                    checked={formData.dateType === '1'} 
                    onChange={e => setFormData({...formData, dateType: e.target.value})}
                    className="mr-2 accent-[#b2955d]"
                  />
                  <span>公历</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="dateType" 
                    value="0" 
                    checked={formData.dateType === '0'} 
                    onChange={e => setFormData({...formData, dateType: e.target.value})}
                    className="mr-2 accent-[#b2955d]"
                  />
                  <span>农历</span>
                </label>
              </div>
            </div>

            {/* Birth Date */}
            <div className="flex items-center border-b border-gray-200 py-2">
              <label className="w-24 text-gray-600 font-medium">出生时间</label>
              <input 
                type="datetime-local" 
                className="flex-1 outline-none text-gray-800"
                value={formData.birthDate}
                onChange={e => setFormData({...formData, birthDate: e.target.value})}
              />
            </div>

            {/* Location */}
            <div className="flex items-center border-b border-gray-200 py-2">
              <label className="w-24 text-gray-600 font-medium">出生地址</label>
              <div className="flex-1 text-gray-800 cursor-pointer">
                 {formData.location} <span className="text-gray-400 text-sm">(点击选择)</span>
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4 pt-2">
               <label className="flex items-center cursor-pointer text-sm text-gray-600">
                  <input 
                    type="checkbox" 
                    checked={formData.isTrueSolar}
                    onChange={e => setFormData({...formData, isTrueSolar: e.target.checked})}
                    className="mr-2 accent-[#b2955d]"
                  />
                  真太阳时
               </label>
               <label className="flex items-center cursor-pointer text-sm text-gray-600">
                  <input 
                    type="checkbox" 
                    checked={formData.isEarlyRat}
                    onChange={e => setFormData({...formData, isEarlyRat: e.target.checked})}
                    className="mr-2 accent-[#b2955d]"
                  />
                  早晚子时区分
               </label>
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={handleSubmit}
            className="w-full bg-[#b2955d] text-white py-3 rounded-full font-bold text-lg hover:bg-[#a08553] transition active:scale-[0.98] shadow-md"
          >
            开始排盘
          </button>
        </div>

      </div>
    </div>
  );
};

export default InputPage;
