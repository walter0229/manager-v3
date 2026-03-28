import{G as y}from"./main-wVrkuQMD.js";const w=async(i,s)=>{if(!i)throw new Error("API Key is missing");const l=i.replace(/[^\x21-\x7E]/g,"").replace(/["']/g,"").trim(),p=new y(l),r=["gemini-3-flash-preview","gemini-3-pro-preview"];let t=null;for(const e of r)try{console.log(`[Receipt Scan] Attempting with model: ${e}`);const o=p.getGenerativeModel({model:e}),h=s.split(",")[1]||s,u=`
            Analyze this receipt image (likely Vietnamese).
            1. Extract ALL items in the **EXACT ORDER** they appear on the receipt (Top to Bottom).
            2. For 'price', extract the **LINE TOTAL** (Final amount for that line, i.e., Quantity * Unit Price), NOT the unit price.
            3. **Currency Format**: Vietnam uses "." as thousands separator (e.g. 24.000 = 24000). Convert all numbers to pure integers.
            4. TRANSLATE the item names to KOREAN.
            
            Format: "Original Name (Korean Translation)"
            Example: "Cà phê sữa (연유 커피)", "Phở Bò (소고기 쌀국수)"
            
            Return JSON only containing:
            1. "date": YYYY-MM-DD. IMPORTANT: If the year is missing or ambiguous (e.g. "13/01"), YOU MUST USE **2026**. Do NOT use 2025.
            2. "amount": Total payment amount (numeric).
            3. "items": Array of items in Receipt Order.
               - "name": "Original Name (Korean Translation)"
               - "price": Line Total Price (numeric)
               - "category": Infer category from item name. Options: "food", "drink", "alcohol", "health", "shopping", "other" (Default: "shopping")
            4. "summary": A comma-separated list of all item names.
            5. "storeName": The name of the store (Header of receipt).
            
            Example JSON:
            {
                "date": "2026-05-20",
                "amount": 30000,
                "storeName": "Nhà Thuốc An Khang",
                "items": [
                    { "name": "Bánh mì (반미 샌드위치)", "price": 10000, "category": "food" },
                    { "name": "Bia (맥주 2개)", "price": 20000, "category": "alcohol" }
                ],
                "summary": "Bánh mì, Bia"
            }
            `,d=new Promise((E,f)=>setTimeout(()=>f(new Error(`Request timed out for ${e} (45s)`)),45e3)),n=(await Promise.race([o.generateContent([u,{inlineData:{data:h,mimeType:"image/jpeg"}}]),d])).response.text().replace(/```json/g,"").replace(/```/g,"").trim(),m=n.indexOf("{"),c=n.lastIndexOf("}"),T=m!==-1&&c!==-1?n.substring(m,c+1):n,a=JSON.parse(T);if(a.amount||a.date)return console.log(`[Receipt Scan] Success with model: ${e}`),a}catch(o){console.warn(`[Receipt Scan] Model ${e} failed:`,o.message),t=o}console.error(`[Receipt Scan] All models failed. Tried: ${r.join(", ")}. Last error: ${t?.message}`,t);const g=t?.message||"All models failed";throw new Error(`분석 실패: ${g}
(시도된 모델: ${r.join(", ")})
최신 코드가 반영되지 않았을 수 있으니 앱을 완전히 종료 후 다시 시도해주세요.`)};export{w as analyzeReceiptWithGemini};
