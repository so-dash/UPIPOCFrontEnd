import { PHONEPE_BACKEND } from "./Config"

export class PhonePeApi {
    private backendUrl: string = PHONEPE_BACKEND;

    public VerifyVpa = (vpa: string) => {
        return fetch(
            new URL('api/phonepe/vpaValidate', this.backendUrl).toString(),
            {
                method: 'POST',
                headers: new Headers(
                    {
                        "accept": "text/plain",
                        "Content-Type": "application/json",
                    }
                ),
                body: JSON.stringify(
                    {
                        vpa: vpa
                    }
                )
            }
        ).then(res=>{
            if(res.status===200){
                return res;
            }
            throw new Error(`Received response ${res.statusText} with code ${res.status}`);
        }).then(res=>res.json()).then(res=>{
            return res;
        });
    }

    public InitiateCollectRequest = (vpa: string, amount: number, orderid: string) => {
        return fetch(
            new URL('api/phonepe/init', this.backendUrl).toString(),
            {
                method: 'POST',
                headers: new Headers(
                    {
                        "accept": "text/plain",
                        "Content-Type": "application/json",
                    }
                ),
                body: JSON.stringify(
                    {
                        vpa: vpa,
                        orderId: orderid,
                        txnAmount: {
                            value: amount.toString()
                        }

                    }
                )
            }
        ).then(res=>{
            if(res.status===200){
                return res;
            }
            throw new Error(`Received response ${res.statusText} with code ${res.status}`);
        }).then(res=>res.json()).then(res=>{
            return res;
        });
    }

    public InitiateCollectRequestQR = (amount: number, orderid: string) => {
        return fetch(
            new URL('api/phonepe/qrinit', this.backendUrl).toString(),
            {
                method: 'POST',
                headers: new Headers(
                    {
                        "accept": "text/plain",
                        "Content-Type": "application/json",
                    }
                ),
                body: JSON.stringify(
                    {
                        orderId: orderid,
                        txnAmount: {
                            value: amount.toString()
                        }

                    }
                )
            }
        ).then(res=>{
            if(res.status===200){
                return res;
            }
            throw new Error(`Received response ${res.statusText} with code ${res.status}`);
        }).then(res=>res.json()).then(res=>{
            return res;
        });
    }

    public GetStatus = (orderid: string) => {
        return fetch(
            new URL('api/phonepe/status', this.backendUrl).toString(),
            {
                method: 'POST',
                headers: new Headers(
                    {
                        "accept": "text/plain",
                        "Content-Type": "application/json",
                    }
                ),
                body: JSON.stringify(
                    {
                        OrderId: orderid
                    }
                )
            }
        ).then(res=>{
            if(res.status===200){
                return res;
            }
            throw new Error(`Received response ${res.statusText} with code ${res.status}`);
        }).then(res=>res.json()).then(res=>{
            return res;
        });
    }

}