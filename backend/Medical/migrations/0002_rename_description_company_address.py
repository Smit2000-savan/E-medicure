# Generated by Django 4.1.7 on 2023-04-06 07:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Medical', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='company',
            old_name='description',
            new_name='address',
        ),
    ]
