import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1747809906334 implements MigrationInterface {
    name = 'Init1747809906334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "companies" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL, "company_id" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "uq_Companies_company_id" UNIQUE ("company_id"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_Companies_company_id" ON "companies" ("company_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_Companies_company_id"`);
        await queryRunner.query(`DROP TABLE "companies"`);
    }

}
