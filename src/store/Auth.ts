import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "appwrite"
import axios from "axios";

// we are gonna create a reputation for each user based on his/her contribution on the platform 

export interface UserPrefs {
    reputation: number
}

// Interface in TypeScript is a powerful tool that defines the "shape" or structural contract of an object. 
// It specifies exactly what properties and methods an object must have, along with their data types, without providing any actual implementation logic.
// here we are defining an object called the IAuthStore in which we are defining the things we required to authenticate the user and also the methods to implement them, we are also planning for the type safety by providing an alternative for the vairables as null
// this is just for type safety during the complile time and provide structure and could also be skipped in case of javascript 
interface IAuthStore { 
    user: object | null
    userCar: object | null
    hydrated: boolean
    currentLocation: {
        latitude: number,
        longitude: number;
    } | null;
    bookingLocation: {
        latitude: number;
        longitude: number;
    } | null;

    setUserDetails(user: object): void;
    setUserCarDetails(car: object): void;
    setHydrated(): void;
    setCurrentLocation(loc: {latitude: number , longitude: number}): void;
    setBookingLocation(loc: {latitude: number , longitude: number}): void;
    resetStore(): void;
    // verifySession(): Promise<void>;
    
}

// The create function in Zustand initializes a global state store and returns a custom React (((hook))) that components use to read state and trigger actions. It allows you to manage application state externally without needing a context Provider.
// we are creating a store using the zustand library method create() which is told to follow this IAuthStore interface 

// the immer is a higher level abstraction that gives you clean and simple syntax while still preserving immutability (which react and zustand rely on for change detection and performance), without immer you would have to manually create new objects copy everytime you want to update the state which is very verbose and as you would have to use a lot of spread operator, with immer() you can write a cleaner syntax which under the hood do the same spread operator thing but is more readable.
// the set inside the immer is crucial to set make chnages in your state and then notify the react that a change has been made so that the react can refresh the screen and then display the updated data on the screen, we can also use the this.hydrated: true but this will only change the state and will not trigger a page refresh automatically 

// By default, the persist() takes your entire store state (including your functions/actions), converts it into a text string using JSON.stringify(), and saves it into localStorage under the name you provided. By default it is set to localStorage
export const useAuthStore = create<IAuthStore>()(
    persist(
        immer((set) => ({
            user: null,
            userCar: null,
            hydrated: false,
            currentLocation: null,
            bookingLocation: null,

            setUserDetails(user){
                set((state) => {
                    state.user = user
                })
            },

            setUserCarDetails(car){
                set((state) => {
                    state.userCar = car
                })
            },

            setHydrated(){
                set((state) => {
                    state.hydrated = true
                })
            },
  
            setCurrentLocation(loc){
                set((state) => {
                    state.currentLocation = loc;
                })
            },

            setBookingLocation(loc){
                set((state) => {
                    state.bookingLocation = loc;
                })
            },

            resetStore(){
                set((state) => {
                    state.user = null,
                    state.userCar = null,
                    state.hydrated = false,
                    state.currentLocation = null,
                    state.bookingLocation = null
                })
            },
        })),

        {
            name: "auth",
            onRehydrateStorage(){
                return (state, error) => {
                    if (!error) state?.setHydrated()
                }
            }
        }
    )
)

// the name: auth is the key name under which your store is stored inside the localStorage of your browser by the persist method and onRehydrateStorage is the method which returns another function which is executed after the rehydration of the store's state and in the conditional statement we are saying if there is no error then if the state is available then call the setHydrated method which flips the hydrated flag to true

// WORKING : 
// When your app first loads, Zustand creates the store in memory with its default values (the null values), then the persist middleware checks localStorage for a saved JSON snapshot of the store; if one exists (there won't be if the app is visited for the first time), it overlays those values onto the live store (rehydration), and once that’s complete you flip a custom hydrated flag to true so components know the store is ready (this flag will still be flipped to true if the app is visited for the first time). From then on, whenever a state change happens (like login or logout), the store updates immediately in memory (triggering React re-renders) and persist silently writes a new snapshot into localStorage. The hydrated flag doesn’t toggle again — it’s just a one-time signal that rehydration finished. If the page is reloaded, the in‑memory store is wiped, but persist restores it from the snapshot in localStorage and sets hydrated back to true, ensuring your components always see the latest state. In short: memory store drives the UI, localStorage holds a backup copy, persist keeps them in sync, and hydrated tells you when the restore is done.