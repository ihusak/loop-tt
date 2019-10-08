import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable()
class ChartService {
    constructor(private http: HttpClient) {

    }
  public getCoins(ids: string, period: string): Observable<any> {
      return this.http.get(`https://api.coinranking.com/v1/public/coins?ids=${ids}&period=${period}`);
  }
  public getCoinsFull(): Observable<any> {
    return this.http.get(`https://api.coinranking.com/v1/public/coins`);
  }
  public getCoinsById(id): Observable<any> {
    return this.http.get(`https://api.coinranking.com/v1/public/coin/${id}`);
  }
}

export {ChartService};