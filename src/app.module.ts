import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RecipeModule } from './recipe/recipe.module';
import { RecipeIngredientModule } from './recipe-ingredient/recipe-ingredient.module';
import { SupplierStockModule } from './supplier-stock/supplier-stock.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { EventEmitterModule} from '@nestjs/event-emitter'
import { SubRecipeModule } from './sub-recipe/sub-recipe.module';
import { CraftedStockModule } from './crafted-stock/crafted-stock.module';

@Module({
  imports: [
    // Charger les variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true, // Cela permet à ConfigModule d'être accessible dans tous les modules
    }),

    // event driven system
    EventEmitterModule.forRoot(),

    // Configuration de TypeORM avec PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 5432),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Chemin vers les entités
      migrations:[__dirname + '/src/migrations/*.ts'],
      logging: ["error","query"]
      // synchronize: true, // Déconseillé en production, préférer les migrations
    }),
    UserModule,
    IngredientModule,
    RecipeModule,
    RecipeIngredientModule,
    SupplierStockModule,
    SubRecipeModule,
    CraftedStockModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
