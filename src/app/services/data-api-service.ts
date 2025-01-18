import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders }  from '@angular/common/http';
import { forkJoin, Observable,of } from 'rxjs';
import { map,mergeMap } from 'rxjs/operators';
import { Yeoman } from './yeoman.service';
import { AuthRESTService } from "./auth-rest.service";


export interface DocumentInterface{
	categories: any[];
	temas: any[];
	files: string[];
	issue: string;
	image: string;
	serial: string;
	receiver: string;
	subject: string;
	entity: string;
	status: string;
}
export interface BoletinInterface{
	categories: any[];
	temas: any[];
	files: string[];
	issue: string;
	image: string;
	serial: string;
	receiver: string;
	subject: string;
	entity: string;
	status: string;
}
export interface NormativaInterface{
	categories: any[];
	temas: any[];
	files: string[];
	issue: string;
	image: string;
	serial: string;
	receiver: string;
	subject: string;
	entity: string;
	status: string;
}
export interface JurisprudenciaInterface{
	categories: any[];
	temas: any[];
	files: string[];
	issue: string;
	image: string;
	serial: string;
	receiver: string;
	subject: string;
	entity: string;
	status: string;
}
export interface ModelosInterface{
	categories: any[];
	temas: any[];
	files: string[];
	issue: string;
	image: string;
	serial: string;
	receiver: string;
	subject: string;
	entity: string;
	status: string;
	tema: string;
}
export interface PublicidadesInterface{
	id: string;
	categories: any[];
	temas: any[];
	files: string[];
	issue: string;
	image: string;
	whatsapp: string;
	description: string;
	subject: string;
	status: string;
}
 
export interface UserInterface {
	id?:number;
}

export interface MessageInterface{
	id?:number;
}

export interface ClientInterface {
}
export interface MessageInterface {
}
export interface ChatInterface {
}
export interface MemberInterface {

}
export interface CategoryInterface {

}
export interface TemaInterface {

}
export interface RepositorioInterface {

}
@Injectable({
  providedIn: 'root'
})
export class DataApiService {
	//ticket: Observable<any>;
	url:any;
	cards:any;
	orders:any;
	clients:any;
	dists:any;
	client:any;
	chat:any;
	messages:any;
	chats:any;
	cars:any;
	parts:any;
	branch:any;
	cierre:any;
	serial:any;
	transactions:any;
  	constructor(
	  	// public butler:Butler, 
		public yeoman: Yeoman,
  		private AuthRESTService:AuthRESTService,
 	 	private http: HttpClient
  	) {
		}
  	headers : HttpHeaders = new HttpHeaders({  		
		  "Content-Type":"application/json"	
	});
		/* <!--	CREAR	--> */

	saveDocument( document: DocumentInterface) {
		const url_api =  'https://db.vendricom.com:8091/api/collections/vendricomDocuments/records';
		return this.http.post<DocumentInterface>(url_api, document).pipe(
		  map(data => data)
		);
	  }
	  saveNormativa( normativa: NormativaInterface) {
		const url_api =  'https://db.vendricom.com:8091/api/collections/vendricomNormativas/records';
		return this.http.post<NormativaInterface>(url_api, normativa).pipe(
		  map(data => data)
		);
	  }
	  saveBoletin( boletin: BoletinInterface) {
		const url_api =  'https://db.vendricom.com:8091/api/collections/vendricomBoletines/records';
		return this.http.post<BoletinInterface>(url_api, boletin).pipe(
		  map(data => data)
		);
	  }
	  saveJurisprudencia( jurisprudencia: JurisprudenciaInterface) {
		const url_api =  'https://db.vendricom.com:8091/api/collections/vendricomJurisprudencias/records';
		return this.http.post<JurisprudenciaInterface>(url_api, jurisprudencia).pipe(
		  map(data => data)
		);
	  }
	  saveModelos( modelo: ModelosInterface) {
		const url_api =  'https://db.vendricom.com:8091/api/collections/vendricomModelos/records';
		return this.http.post<ModelosInterface>(url_api, modelo).pipe(
		  map(data => data)
		);
	  }
	  savePublicidades( publicidades: PublicidadesInterface) {
		const url_api =  'https://db.vendricom.com:8091/api/collections/vendricomPublicidad/records';
		return this.http.post<PublicidadesInterface>(url_api, publicidades).pipe(
		  map(data => data)
		);
	  }
	  changePassword(userId: string, newPassword: string): Observable<any> {
		const url = `${this.yeoman.origin.restUrl}/api/UserPasswords/changePassword`;
		const data = { userId, newPassword };
		return this.http.post(url, data);
	  }

	  saveCategory( category: CategoryInterface) {
		const url_api = 'https://db.vendricom.com:8091/api/collections/vendricomCategories/records';
		return this.http.post<CategoryInterface>(url_api, category).pipe(
		  map(data => data)
		);
	  }
	  saveTema( category: TemaInterface) {
		const url_api = 'https://db.vendricom.com:8091/api/collections/vendricomTemas/records';
		return this.http.post<TemaInterface>(url_api, category).pipe(
		  map(data => data)
		);
	  }
	  saveRepositorio( repositorio: RepositorioInterface) {
		const url_api = 'https://db.vendricom.com:8091/api/collections/vendricomRepositorios/records';
		return this.http.post<RepositorioInterface>(url_api, repositorio).pipe(
		  map(data => data)
		);
	  }
	  saveCliente( cliente: ClientInterface) {	
		const url_api = 'https://db.vendricom.com:8091/api/collections/clientes/records';
		return this.http.post<ClientInterface>(url_api, cliente).pipe(
		  map(data => data)
		);
	  }
	  saveMessage(message:MessageInterface){
		const url_api=	this.yeoman.origin.restUrl+'/api/messages';
		return this.http
		.post<MessageInterface>(url_api, message)
		.pipe(map(data => data));
	}
	
	/* <!--	LEER	--> */
	
	getAllChats(){
		const url_api = this.yeoman.origin.restUrl+'/api/chats';
		return this.http.get(url_api);
	}
	getMessagesBy(idChat: string){
		const url_api = this.yeoman.origin.restUrl+`/api/messages?filter[idUserwhere][idChat]=${idChat}`;
		this.messages = this.http.get(url_api);
		return ( this.http.get(url_api));		
	}
	getAllCards(){
		const url_api = this.yeoman.origin.restUrl+'/api/cards';
		return this.http.get(url_api);
	}

	getClientBy(idUser: string){
		const url_api = this.yeoman.origin.restUrl+`/api/clients?filter[where][idUser]=c${idUser}`;
		this.clients = this.http.get(url_api);
		return ( this.http.get(url_api));		
	}
	
	/* <!--	BORRAR	--> */


	deleteDocuments(id: string) {
		const url_api = `${this.yeoman.origin.restUrl}/api/collections/vendricomDocuments/records/${id}`;
			return this.http.delete<DocumentInterface>(url_api).pipe(map((data) => data));
		  }
	deleteClientOperator(id: string) {
	const url_api = `https://db.vendricom.com:8091/api/collections/clientes/records/${id}`;
	return this.http.delete<ClientInterface>(url_api).pipe(map((data) => data));
	}
	deleteJurisprudencia(id: string) {
		const url_api = `https://db.vendricom.com:8091/api/collections/vendricomJurisprudencias/records/${id}`;
		return this.http.delete<ClientInterface>(url_api).pipe(map((data) => data));
	}
	deleteTema(id: string) {
		const url_api = `https://db.vendricom.com:8091/api/collections/vendricomTemas/records/${id}`;
		return this.http.delete<ClientInterface>(url_api).pipe(map((data) => data));
	}
	deleteCategory(id: string) {
		const url_api = `https://db.vendricom.com:8091/api/collections/vendricomCategories/records/${id}`;
		return this.http.delete<ClientInterface>(url_api).pipe(map((data) => data));
	}
	deleteRepositorio(id: string) {
		const url_api = `https://db.vendricom.com:8091/api/collections/vendricomRepositorios/records/${id}`;
		return this.http.delete<ClientInterface>(url_api).pipe(map((data) => data));
	}
	deleteNormativa(id: string) {
		const url_api = `${this.yeoman.origin.restUrl}/api/collections/vendricomNormativas/records/${id}`;
		return this.http.delete<DocumentInterface>(url_api).pipe(map((data) => data));
	}
	deleteBoletin(id: string) {
		const url_api = `${this.yeoman.origin.restUrl}/api/collections/vendricomBoletines/records/${id}`;
		return this.http.delete<DocumentInterface>(url_api).pipe(map((data) => data));
		}
	deleteModelo(id: string) {
		const url_api = `${this.yeoman.origin.restUrl}/api/collections/vendricomModelos/records/${id}`;
		return this.http.delete<DocumentInterface>(url_api).pipe(map((data) => data));
		}
	deletePublicidad(id: string) {
		const url_api = `${this.yeoman.origin.restUrl}/api/collections/vendricomPublicidad/records/${id}`;
		return this.http.delete<DocumentInterface>(url_api).pipe(map((data) => data));
		}
	deleteChat(id: string){
		const token = this.AuthRESTService.getToken();
		const url_api=	this.yeoman.origin.restUrl+`/api/chats/${id}/?access_token$={token}`;
		return this.http
		.delete<ChatInterface>(url_api, {headers: this.headers})
		.pipe(map(data => data));
	}
	deleteMessage(idChat: string){
		const token = this.AuthRESTService.getToken();
		const url_api=	this.yeoman.origin.restUrl+`/api/messages?filter[where][idChat]=${idChat}/?access_token$={token}`;
		return this.http
		.delete<MessageInterface>(url_api, {headers: this.headers})
		.pipe(map(data => data));
	}
	deleteMember(id: string){
		const token = this.AuthRESTService.getToken();
		const url_api=	this.yeoman.origin.restUrl+`/api/cards/${id}/?access_token$={token}`;
		return this.http
		.delete<MemberInterface>(url_api, {headers: this.headers})
		.pipe(map(data => data));
	}
	
	/* <!--	ACTUALIZAR	--> */
	updateDocument(data: any, id: string): Observable<any> {
	const url = `https://db.vendricom.com:8091/api/collections/vendricomDocuments/records/${id}`;
	return this.http.patch(url, data).pipe(
		map(response => response)
	);
	}
	updateTema(data: any, id: string): Observable<any> {
	const url = `https://db.vendricom.com:8091/api/collections/vendricomTemas/records/${id}`;
	return this.http.patch(url, data).pipe(
		map(response => response)
	);
	}
	updateCategory(data: any, id: string): Observable<any> {
	const url = `https://db.vendricom.com:8091/api/collections/vendricomCategories/records/${id}`;
	return this.http.patch(url, data).pipe(
		map(response => response)
	);
	}
	updateRepositorio(data: any, id: string): Observable<any> {	
	const url = `https://db.vendricom.com:8091/api/collections/vendricomRepositorios/records/${id}`;
	return this.http.patch(url, data).pipe(
		map(response => response)
	);
	}
	updateJurisprudencia(data: any, id: string): Observable<any> {
	const url = `https://db.vendricom.com:8091/api/collections/vendricomJurisprudencias/records/${id}`;
	return this.http.patch(url, data).pipe(
		map(response => response)
	);
	}
	updateNormativa(data: any, id: string): Observable<any> {
	const url = `https://db.vendricom.com:8091/api/collections/vendricomNormativas/records/${id}`;
	return this.http.patch(url, data).pipe(
		map(response => response)
	);
	}
	updateModelos(data: any, id: string): Observable<any> {
	const url = `https://db.vendricom.com:8091/api/collections/vendricomModelos/records/${id}`;
	return this.http.patch(url, data).pipe(
		map(response => response)
	);
	}
	updateBoletin(data: any, id: string): Observable<any> {
	const url = `https://db.vendricom.com:8091/api/collections/vendricomBoletines/records/${id}`;
	return this.http.patch(url, data).pipe(
		map(response => response)
	);
	}
	updatePublicidad(data: any, id: string): Observable<any> {
	const url = `https://db.vendricom.com:8091/api/collections/vendricomPublicidad/records/${id}`;
	return this.http.patch(url, data).pipe(
		map(response => response)
	);
	}
	updateContact(data: any, id: string): Observable<any> {
	const url = `https://db.vendricom.com:8091/api/collections/clientes/records/${id}`;
	
	// Verificar los datos antes de enviarlos
	console.log('Datos enviados a la API:', data); 
	
	return this.http.patch(url, data).pipe(
		map(response => {
		// Verificar la respuesta recibida de la API
		console.log('Respuesta de la API:', response);  
		return response;
		})
	);
	}
	userUpdate(id: string, userUpdate: UserInterface) {
	const token = this.AuthRESTService.getToken();
	// const url_api = `${this.yeoman.origin.restUrl}/api/Users/${id}/?access_token=${token}`;
	const url_api = `${this.yeoman.origin.restUrl}/api/Users/${id}?access_token=${token}`;

	return this.http
		.put<UserInterface>(url_api, userUpdate, { headers: this.headers })
		.pipe(map(data => data));
	}
		  
	
	
	
}