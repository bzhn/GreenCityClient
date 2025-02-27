import { ShoppingList } from '@user-models/shoppinglist.interface';
import { HabitTranslationInterface } from './habit.interface';

export interface CustomHabitDtoRequest {
  habitTranslations: HabitTranslationInterface[];
  complexity: number;
  defaultDuration: number;
  image: string;
  tagIds: number[];
  customShoppingListItemDto: ShoppingList[];
  id?: number;
  userId?: number;
}

export interface CustomHabit {
  title: string;
  description: string;
  complexity: number;
  duration: number;
  tagIds: number[];
  image: string;
  shopList: ShoppingList[];
}

export interface HabitPageable {
  page?: number;
  size?: number;
  tags?: Array<string>;
  lang?: string;
  excludeAssigned?: boolean;
  habit?: CustomHabit;
  id?: number;
  filters?: string[];
  sort?: 'asc' | 'desc';
}
