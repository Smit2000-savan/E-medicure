# Generated by Django 4.1.7 on 2023-03-29 11:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Medical', '0002_alter_bill_generateddate_alter_stock_arrivaldate_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='billitem',
            name='medName',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='Medical.medicine'),
        ),
    ]
